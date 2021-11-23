import type Player from '../player/index.js'
import type GameResultsQuestion from './question.js'

export default interface GameResults {
	/** Next game code. */
	next: string | null

	/** Top 3 players. */
	players: Player[] | null

	questions: GameResultsQuestion[]
}
