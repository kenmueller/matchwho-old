import type PlayerFromDatabase from './player.js'
import type QuestionFromDatabase from './question.js'

export default interface GameFromDatabase {
	code: string

	/** Next game code. */
	next: string | null

	/** Milliseconds since epoch. */
	completed: number

	/**
	 * Includes only the top players.
	 * Sorted from top to bottom by points.
	 */
	players: PlayerFromDatabase[]

	questions: QuestionFromDatabase[]
}
