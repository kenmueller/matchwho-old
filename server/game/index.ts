import { nanoid } from 'nanoid'

import CODE_LENGTH from './code.js'

export default class Game {
	static readonly games: Record<string, Game> = {}

	readonly code = nanoid(CODE_LENGTH).toLowerCase()

	constructor() {
		Game.games[this.code] = this
	}
}
