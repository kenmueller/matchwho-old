import { nanoid } from 'nanoid'

import CODE_LENGTH from './code.js'

export default class Game {
	private static readonly games: Record<string, Game> = {}

	readonly id = nanoid(CODE_LENGTH).toLowerCase()

	constructor() {
		Game.games[this.id] = this
	}
}
