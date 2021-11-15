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

export default class Game {
	private static readonly games: Record<string, Game> = {}

	readonly code = nanoid(CODE_LENGTH).toLowerCase()

	players: Player[] = []
	spectators: Player[] = []

	state: GameState = 'joining'
	round = 1
	index = 0

	constructor() {
		Game.games[this.code] = this
	}

	static readonly validCode = (code: string) => code.length === CODE_LENGTH

	static readonly withCode = (code: string) =>
		Object.prototype.hasOwnProperty.call(Game.games, code)
			? Game.games[code]
			: null

	get leader() {
		return this.players[0] ?? null
	}

	get current() {
		return this.players[this.index] ?? null
	}

	get meta(): GameMeta {
		const { state, leader } = this
		return { state, leader: leader && leader.name }
	}

	readonly join = (socket: WebSocket, name: string) => {
		const spectating = !(this.state === 'joining' && name)

		const player: Player = {
			socket,
			spectating,
			id: nanoid(ID_LENGTH),
			name,
			leader: !this.leader
		}

		this[spectating ? 'spectators' : 'players'].push(player)
		if (!spectating) this.sendGame()

		return player
	}

	readonly leave = (player: Player) => {
		const index = this.players.indexOf(player)

		if (index < 0) return
		if (index < this.index) this.index--

		this.players.splice(index, 1)

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
		const players = this.players
			.filter(({ spectating }) => !spectating)
			.map(dataFromPlayer)

		for (const player of this.players) {
			const data: ServerGameData = {
				key: 'game',
				value: {
					state: this.state,
					round: this.round,
					// turn: {
					// 	state: 'answering',
					// 	player: this.current
					// },
					self: player.spectating ? null : dataFromPlayer(player),
					players
				}
			}

			player.socket.send(JSON.stringify(data))
		}
	}
}

export interface GameMeta {
	readonly state: GameState
	readonly leader: string | null
}
