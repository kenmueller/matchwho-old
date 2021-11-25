import HttpError, { HttpErrorCode } from '../../../shared/error/http.js'
import GameTurnState from '../../../shared/game/turn/state.js'
import MAX_ANSWER_LENGTH from '../../../shared/game/answer.js'
import type Game from '../index.js'
import type Player from '../player.js'
import log from '../../log/value.js'
import logError from '../../log/error.js'

const onAnswer = (game: Game, player: Player, value: string) => {
	if (typeof value !== 'string')
		throw logError(
			'Receiving answer',
			new HttpError(HttpErrorCode.Socket, 'Invalid answer')
		)

	const answer = value.trim()

	if (!answer)
		throw logError(
			'Receiving answer',
			new HttpError(HttpErrorCode.Socket, 'Your answer cannot be empty')
		)

	if (answer.length > MAX_ANSWER_LENGTH)
		throw logError(
			'Receiving answer',
			new HttpError(HttpErrorCode.Socket, 'Your answer is too long')
		)

	const { current } = game

	if (!current)
		throw logError(
			'Receiving answer',
			new HttpError(HttpErrorCode.Socket, 'The questioner does not exist')
		)

	if (player.id === current.id)
		throw logError(
			'Receiving answer',
			new HttpError(HttpErrorCode.Socket, 'You cannot answer your own question')
		)

	if (game.turn.state !== GameTurnState.Answering)
		throw logError(
			'Receiving answer',
			new HttpError(
				HttpErrorCode.Socket,
				'Answering is not allowed at this time'
			)
		)

	if (player.answer !== null)
		throw logError(
			'Receiving answer',
			new HttpError(HttpErrorCode.Socket, 'An answer has already been provided')
		)

	player.answer = answer
	const { answers, question } = game

	if (answers)
		game.turn = {
			...game.turn,
			state: GameTurnState.Matching,
			answers,
			matches: {}
		}

	if (!question) return

	question.answers.push({
		name: player.name,
		answer: player.answer
	})

	log('Received answer', {
		question: { player: question.name, question: question.question },
		answer: { player: player.name, answer: player.answer }
	})
}

export default onAnswer
