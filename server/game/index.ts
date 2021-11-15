import type WebSocket from 'ws'
import { nanoid } from 'nanoid'

import CODE_LENGTH from './code.js'
import ID_LENGTH from './id.js'
import HttpsError from '../error/https.js'
import Player, { dataFromPlayer } from './player.js'
import type IncomingGameData from './data/incoming.js'
import type OutgoingGameData from './data/outgoing.js'
import type GameState from './state.js'

export default class Game {
	private static readonly games: Record<string, Game> = {}

	readonly code = nanoid(CODE_LENGTH).toLowerCase()
	readonly players = new Map<string, Player>()

	leader: Player | null = null
	state: GameState = 'joining'

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
		return { state: state, leader: leader && leader.name }
	}

	readonly join = (socket: WebSocket, name: string) => {
		const leader = !this.players.size

		const player: Player = {
			socket,
			spectating: this.state === 'started' || !name,
			id: nanoid(ID_LENGTH),
			name,
			leader
		}

		this.players.set(player.id, player)
		if (leader) this.leader = player

		this.sendGame()
		return player
	}

	readonly leave = (player: Player) => {
		this.players.delete(player.id)

		if (player.leader) {
			const [firstPlayer] = this.players.values()
			if (firstPlayer) firstPlayer.leader = true
		}

		this.sendGame()
	}

	readonly onMessage = (player: Player, message: IncomingGameData) => {
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

	private readonly sendGame = () => {
		const players = [...this.players.values()]
			.filter(({ spectating }) => !spectating)
			.map(dataFromPlayer)

		for (const player of this.players.values()) {
			const data: OutgoingGameData = {
				key: 'game',
				value: {
					state: this.state,
					current: player.spectating ? null : dataFromPlayer(player),
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
