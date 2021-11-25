import type GameResultsAnswer from './answer.js'

export default interface GameResultsQuestion {
	/** Player name. */
	name: string

	question: string
	answers: GameResultsAnswer[]
}
