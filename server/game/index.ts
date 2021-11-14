import { nanoid } from 'nanoid'

import CODE_LENGTH from './code.js'

export default class Game {
	private static readonly games: Record<string, Game> = {}

	readonly code = nanoid(CODE_LENGTH).toLowerCase()

	constructor() {
		Game.games[this.code] = this
	}

	static readonly validCode = (code: string) => code.length === CODE_LENGTH

	static readonly withCode = (code: string) =>
		Object.prototype.hasOwnProperty.call(Game.games, code)
			? Game.games[code]
			: null
}
