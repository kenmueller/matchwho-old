import type WebSocket from 'ws'
import { nanoid } from 'nanoid'
import shuffle from 'shuffle-array'

import CODE_LENGTH from '../../shared/game/code.js'
import ID_LENGTH from '../../shared/game/id.js'
import ROUNDS from '../../shared/game/rounds.js'
import { MAX_PLAYERS } from '../../shared/game/player/bounds.js'
import MAX_NAME_LENGTH from '../../shared/game/name.js'
import HttpError, { HttpErrorCode } from '../../shared/error/http.js'
import Player, { dataFromPlayer, dataFromSelf } from './player.js'
import type ServerGameData from '../../shared/game/data/server.js'
import type ClientGameData from '../../shared/game/data/client.js'
import GameState from '../../shared/game/state.js'
import GameTurnState from '../../shared/game/turn/state.js'
import type GameMeta from '../../shared/game/meta.js'
import type GameTurn from '../../shared/game/turn/index.js'
import type InternalGameTurn from './turn.js'
import onStart from './message/start.js'
import onQuestion from './message/question.js'
import onAnswer from './message/answer.js'
import onMatch from './message/match.js'
import onUnmatch from './message/unmatch.js'

export default class Game {
	static games: Record<string, Game> = {}

	code = nanoid(CODE_LENGTH).toLowerCase()

	players: Player[] = []
	spectators: Player[] = []

	state = GameState.Joining

	round = 1
	index = 0

	turn: InternalGameTurn = {
		state: GameTurnState.Waiting,
		question: null,
		answers: null,
		matches: null
	}

	constructor() {
		Game.games[this.code] = this
	}

	static validCode = (code: string) => code.length === CODE_LENGTH

	static withCode = (code: string) =>
		Object.prototype.hasOwnProperty.call(Game.games, code)
			? Game.games[code]
			: null

	get meta(): GameMeta {
		const { state, leader } = this
		return { state, leader: leader && leader.name }
	}

	get leader() {
		return this.players[0] ?? null
	}

	get current() {
		return this.players[this.index] ?? null
	}

	get answers() {
		const { current } = this
		if (!current) return null

		const players = this.players
			.filter(({ id }) => id !== current.id)
			.map(({ answer }) => answer)

		return players.every(Boolean) ? shuffle(players as string[]) : null
	}

	join = (socket: WebSocket, name: string) => {
		if (this.state === GameState.Completed)
			throw new HttpError(HttpErrorCode.Socket, 'This game has already ended')

		if (name.length > MAX_NAME_LENGTH)
			throw new HttpError(HttpErrorCode.Socket, 'Your name is too long')

		const player: Player = {
			socket,
			spectating:
				this.players.length >= MAX_PLAYERS ||
				this.state === GameState.Started ||
				!name,
			id: nanoid(ID_LENGTH),
			name,
			leader: !this.leader,
			points: 0,
			answer: null
		}

		this.listOf(player).push(player)
		player.spectating ? this.sendGame(player) : this.sendGame()

		return player
	}

	leave = (player: Player) => {
		const list = this.listOf(player)

		const index = list.indexOf(player)
		if (index < 0) return

		list.splice(index, 1)

		if (player.spectating) return
		if (index < this.index) this.index--

		if (index === this.index)
			this.turn = {
				state: GameTurnState.Waiting,
				question: null,
				answers: null,
				matches: null
			}

		this.playersChanged()
		this.sendGame()
	}

	playersChanged = () => {
		if (this.index < this.players.length) return

		if (this.round === ROUNDS) {
			this.state = GameState.Completed
		} else {
			this.round++
			this.index = 0
		}
	}

	onMessage = (player: Player, message: ClientGameData) => {
		switch (message.key) {
			case 'start':
				onStart(this, player)
				break
			case 'question':
				onQuestion(this, player, message.value)
				break
			case 'answer':
				onAnswer(this, player, message.value)
				break
			case 'match':
				onMatch(this, player, message.value)
				break
			case 'unmatch':
				onUnmatch(this, player, message.value)
				break
			default:
				throw new HttpError(HttpErrorCode.Socket, 'Invalid message')
		}

		this.sendGame()
	}

	sendGame = (...destinations: Player[]) => {
		const { current } = this

		const turn: GameTurn = current && {
			...this.turn,
			player: dataFromPlayer(current)
		}

		const players = this.players.map(dataFromPlayer)

		destinations = destinations.length
			? destinations
			: [...this.players, ...this.spectators]

		for (const player of destinations) {
			const data: ServerGameData = {
				key: 'game',
				value: {
					state: this.state,
					round: this.round,
					turn,
					self: player.spectating ? null : dataFromSelf(player),
					players
				}
			}

			player.socket.send(JSON.stringify(data))
		}
	}

	listOf = (player: Player) =>
		this[player.spectating ? 'spectators' : 'players']
}
