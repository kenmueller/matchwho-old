import type AnswerFromDatabase from './answer.js'

export default interface QuestionFromDatabase {
	/** Player name. */
	name: string

	question: string
	answers: AnswerFromDatabase[]
}
