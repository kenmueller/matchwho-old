import type SavedAnswer from './answer.js'

export default interface SavedQuestion {
	/** Player name. */
	name: string

	question: string
	answers: SavedAnswer[]
}
