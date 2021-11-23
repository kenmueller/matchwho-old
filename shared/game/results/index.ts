import type GameResultsQuestion from './question.js'

export default interface GameResults {
	/** Next game id. */
	next: string | null

	questions: GameResultsQuestion[]
}
