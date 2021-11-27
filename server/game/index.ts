import type WebSocket from 'ws'
import { nanoid } from 'nanoid'
import shuffle from 'shuffle-array'

import CODE_LENGTH from '../../shared/game/code.js'
import ID_LENGTH from '../../shared/game/id.js'
import ROUNDS from '../../shared/game/rounds.js'
import TOP_PLAYERS from '../../shared/game/player/top.js'
import { MIN_PLAYERS, MAX_PLAYERS } from '../../shared/game/player/bounds.js'
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
import type GameResults from '../../shared/game/results/index.js'
import type SavedGame from '../../shared/game/saved/index.js'
import saveGame from './saved/create.js'
import onStart from './message/start.js'
import onQuestion from './message/question.js'
import onAnswer from './message/answer.js'
import onMatch from './message/match.js'
import onUnmatch from './message/unmatch.js'
import onMatched from './message/matched.js'
import onDone from './message/done.js'
import onNext from './message/next.js'
import log from '../log/value.js'
import logError from '../log/error.js'

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
		matches: null,
		correct: null
	}

	results: GameResults = {
		next: null,
		players: null,
		questions: []
	}

	constructor() {
		Game.games[this.code] = this
		log('Created game', this.code)
	}

	static validCode = (code: string) =>
		log('Valid code', code.length === CODE_LENGTH, code)

	static withCode = (code: string) =>
		Object.prototype.hasOwnProperty.call(Game.games, code)
			? Game.games[code]
			: null

	get meta(): GameMeta {
		return log(
			'Game meta',
			{
				state: this.state,
				leader: this.leader?.name ?? null,
				next: this.results.next
			},
			this.code
		)
	}

	get leader() {
		return this.players[0] ?? null
	}

	get current() {
		return this.players[this.index] ?? null
	}

	get question() {
		return this.results.questions[this.results.questions.length - 1] ?? null
	}

	get notCurrent() {
		const { current } = this
		return current && this.players.filter(({ id }) => id !== current.id)
	}

	get answers() {
		const players = this.notCurrent?.map(({ answer }) => answer)
		return players?.every(Boolean) ? shuffle(players as string[]) : null
	}

	/** If all answers are matched. */
	get matched() {
		const players = this.notCurrent
		const { matches } = this.turn

		return (
			!(players === null || matches === null) &&
			players.length <= Object.keys(matches).length
		)
	}

	/** Includes only the top players. */
	get slimResults(): GameResults {
		return {
			...this.results,
			players: this.results.players?.slice(0, TOP_PLAYERS) ?? null
		}
	}

	get saved(): SavedGame {
		const { code, slimResults: results } = this
		const { next, players, questions } = results

		return {
			code,
			next,
			players:
				players?.map(({ id, name, points }) => ({ id, name, points })) ?? [],
			questions
		}
	}

	listOf = (player: Player) =>
		this[player.spectating ? 'spectators' : 'players']

	join = (socket: WebSocket, name: string) => {
		if (name.length > MAX_NAME_LENGTH)
			throw logError(
				'Attempted to join game',
				new HttpError(HttpErrorCode.Socket, 'Your name is too long'),
				this.code
			)

		const player: Player = {
			socket,
			spectating: !(
				this.players.length < MAX_PLAYERS &&
				this.state === GameState.Joining &&
				name
			),
			id: nanoid(ID_LENGTH),
			name,
			points: 0,
			answer: null
		}

		log('Joining game', { id: player.id, name: player.name }, this.code)

		this.listOf(player).push(player)
		player.spectating ? this.sendGame(player) : this.sendGame()

		return player
	}

	leave = (player: Player) => {
		log('Leaving game', { id: player.id, name: player.name }, this.code)

		const list = this.listOf(player)

		const index = list.indexOf(player)
		if (index < 0) return

		list.splice(index, 1)

		switch (this.state) {
			case GameState.Started:
				if (player.spectating) return

				if (this.players.length < MIN_PLAYERS) {
					this.complete()
				} else {
					if (index < this.index) this.index--
					if (index === this.index) this.resetTurn()

					if (this.index >= this.players.length) {
						this.nextRound()
						this.resetTurn()
					}
				}

				break
			case GameState.Completed:
				if (this.players.length || this.spectators.length) break

				delete Game.games[this.code]
				log('Deleted game', this.code)

				return
		}

		this.sendGame()
	}

	nextRound = () => {
		if (this.round === ROUNDS) {
			this.complete()
		} else {
			this.round++
			this.index = 0
		}
	}

	resetTurn = () => {
		for (const player of this.players) player.answer = null

		this.turn = {
			state: GameTurnState.Waiting,
			question: null,
			answers: null,
			matches: null,
			correct: null
		}
	}

	complete = () => {
		this.state = GameState.Completed

		this.results.players = [...this.players]
			.sort((a, b) => b.points - a.points)
			.map(dataFromPlayer)

		saveGame(this).catch(error => {
			logError('Attempted to save game in database', error, this.code)
		})
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
			case 'matched':
				onMatched(this, player)
				break
			case 'done':
				onDone(this, player)
				break
			case 'next':
				onNext(this, player)
				break
			default:
				throw logError(
					'Received message',
					new HttpError(
						HttpErrorCode.Socket,
						`Invalid message ${JSON.stringify(message)}`
					),
					this.code
				)
		}

		this.sendGame()
	}

	sendGame = (...destinations: Player[]) => {
		const { code, state, round, leader: gameLeader, current } = this

		const turn: GameTurn = current && {
			...this.turn,
			player: dataFromPlayer(current)
		}

		const results = this.state === GameState.Completed ? this.slimResults : null

		const leader = gameLeader && dataFromPlayer(gameLeader)
		const players = this.players.map(dataFromPlayer)

		destinations = destinations.length
			? destinations
			: [...this.players, ...this.spectators]

		for (const player of destinations) {
			const data: ServerGameData = {
				key: 'game',
				value: {
					code,
					state,
					round,
					turn,
					results,
					self: player.spectating ? null : dataFromSelf(player),
					leader,
					players
				}
			}

			player.socket.send(JSON.stringify(data))
		}

		log(`Sent game to ${destinations.length} players`, state, code)
	}
}
