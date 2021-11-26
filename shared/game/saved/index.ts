import type SavedPlayer from './player.js'
import type SavedQuestion from './question.js'

export default interface SavedGame {
	code: string

	/** Next game code. */
	next: string | null

	/**
	 * Includes only the top players.
	 * Sorted from top to bottom by points.
	 */
	players: SavedPlayer[]

	questions: SavedQuestion[]
}
