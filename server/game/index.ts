import type WebSocket from 'ws'
import { nanoid } from 'nanoid'

import CODE_LENGTH from './code.js'
import type Player from './player.js'

export default class Game {
	private static readonly games: Record<string, Game> = {}

	readonly code = nanoid(CODE_LENGTH).toLowerCase()
	readonly players = new Map<WebSocket, Player>()

	leader: string | null = null

	constructor() {
		Game.games[this.code] = this
	}

	static readonly validCode = (code: string) => code.length === CODE_LENGTH

	static readonly withCode = (code: string) =>
		Object.prototype.hasOwnProperty.call(Game.games, code)
			? Game.games[code]
			: null

	get meta(): GameMeta {
		return { leader: this.leader }
	}

	readonly join = (socket: WebSocket, name: string) => {
		if (!this.players.size) this.leader = name
		this.players.set(socket, { socket, name })
	}
}

export interface GameMeta {
	leader: string | null
}
