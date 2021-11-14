import type WebSocket from 'ws'
import { nanoid } from 'nanoid'

import CODE_LENGTH from './code.js'
import ID_LENGTH from './id.js'
import Player, { dataFromPlayer } from './player.js'
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
		return { leader: this.leader && this.leader.name }
	}

	readonly join = (socket: WebSocket, name: string) => {
		const leader = !this.players.size

		const player: Player = {
			socket,
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
			const firstPlayer = [...this.players.values()][0]
			if (firstPlayer) firstPlayer.leader = true
		}

		this.sendGame()
	}

	private readonly sendGame = () => {
		const players = [...this.players.values()]
		const values = players.map(dataFromPlayer)

		for (const player of players) {
			const data: OutgoingGameData = {
				key: 'game',
				value: {
					state: this.state,
					current: dataFromPlayer(player),
					players: values
				}
			}

			player.socket.send(JSON.stringify(data))
		}
	}
}

export interface GameMeta {
	readonly leader: string | null
}
