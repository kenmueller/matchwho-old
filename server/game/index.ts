import type WebSocket from 'ws'
import { nanoid } from 'nanoid'

import CODE_LENGTH from '../../shared/game/code.js'
import ID_LENGTH from '../../shared/game/id.js'
import ROUNDS from '../../shared/game/rounds.js'
import HttpsError from '../../shared/error/https.js'
import Player, { dataFromPlayer } from './player.js'
import type ServerGameData from '../../shared/game/data/server.js'
import type ClientGameData from '../../shared/game/data/client.js'
import type GameState from '../../shared/game/state.js'
import type GameMeta from '../../shared/game/meta.js'
import type GameTurn from '../../shared/game/turn/index.js'
import type InternalGameTurn from './turn.js'

export default class Game {
	private static readonly games: Record<string, Game> = {}

	readonly code = nanoid(CODE_LENGTH).toLowerCase()

	private readonly players: Player[] = []
	private readonly spectators: Player[] = []

	state: GameState = 'joining'

	private round = 1
	private index = 0
	private turn: InternalGameTurn = { state: 'waiting', question: null }

	constructor() {
		Game.games[this.code] = this
	}

	static readonly validCode = (code: string) => code.length === CODE_LENGTH

	static readonly withCode = (code: string) =>
		Object.prototype.hasOwnProperty.call(Game.games, code)
			? Game.games[code]
			: null

	get meta(): GameMeta {
		const { state, leader } = this
		return { state, leader: leader && leader.name }
	}

	private get leader() {
		return this.players[0] ?? null
	}

	private get current() {
		return this.players[this.index] ?? null
	}

	readonly join = (socket: WebSocket, name: string) => {
		const spectating = !(this.state === 'joining' && name)

		const player: Player = {
			socket,
			spectating,
			id: nanoid(ID_LENGTH),
			name,
			leader: !this.leader,
			points: 0,
			answer: null
		}

		this.listOf(player).push(player)
		if (!spectating) this.sendGame()

		return player
	}

	readonly leave = (player: Player) => {
		const list = this.listOf(player)

		const index = list.indexOf(player)
		if (index < 0) return

		list.splice(index, 1)

		if (player.spectating) return
		if (index < this.index) this.index--

		this.playersChanged()
		this.sendGame()
	}

	readonly onMessage = (player: Player, message: ClientGameData) => {
		switch (message.key) {
			case 'start':
				if (this.state !== 'joining')
					throw new HttpsError(1003, 'The game has already started')

				if (!player.leader)
					throw new HttpsError(1003, 'You must be the leader to start the game')

				this.state = 'started'
				this.sendGame()

				break
			case 'question': {
				if (!message.value) throw new HttpsError(1003, 'Invalid question')

				const { current } = this

				if (!current)
					throw new HttpsError(1003, 'The questioner does not exist')

				if (player.id !== current.id)
					throw new HttpsError(1003, 'You are not allowed to ask a question')

				if (this.turn.state !== 'waiting')
					throw new HttpsError(1003, 'Asking is not allowed at this time')

				if (this.turn.question !== null)
					throw new HttpsError(1003, 'A question has already been provided')

				this.turn = { state: 'answering', question: message.value }
				this.sendGame()

				break
			}
			case 'answer': {
				if (!message.value) throw new HttpsError(1003, 'Invalid answer')

				const { current } = this

				if (!current)
					throw new HttpsError(1003, 'The questioner does not exist')

				if (player.id === current.id)
					throw new HttpsError(1003, 'You cannot answer your own question')

				if (this.turn.state !== 'answering')
					throw new HttpsError(1003, 'Answering is not allowed at this time')

				if (player.answer !== null)
					throw new HttpsError(1003, 'An answer has already been provided')

				player.answer = message.value
				this.sendGame()

				break
			}
		}
	}

	private readonly playersChanged = () => {
		if (this.index < this.players.length) return

		if (this.round === ROUNDS) {
			this.state = 'completed'
		} else {
			this.round++
			this.index = 0
		}
	}

	private readonly sendGame = () => {
		const { current } = this

		const turn: GameTurn = current && {
			...this.turn,
			player: dataFromPlayer(current)
		}

		const players = this.players.map(dataFromPlayer)

		for (const player of [...this.players, ...this.spectators]) {
			const data: ServerGameData = {
				key: 'game',
				value: {
					state: this.state,
					round: this.round,
					turn,
					self: player.spectating ? null : dataFromPlayer(player),
					players
				}
			}

			player.socket.send(JSON.stringify(data))
		}
	}

	private readonly listOf = (player: Player) =>
		this[player.spectating ? 'spectators' : 'players']
}
