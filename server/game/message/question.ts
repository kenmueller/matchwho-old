import HttpError, { HttpErrorCode } from '../../../shared/error/http.js'
import GameTurnState from '../../../shared/game/turn/state.js'
import MAX_QUESTION_LENGTH from '../../../shared/game/question.js'
import type Game from '../index.js'
import type Player from '../player.js'
import log from '../../log/value.js'
import logError from '../../log/error.js'

const onQuestion = (game: Game, player: Player, value: string) => {
	if (typeof value !== 'string')
		throw logError(
			'Receiving question request',
			new HttpError(HttpErrorCode.Socket, 'Invalid question')
		)

	const question = value.trim()

	if (!question)
		throw logError(
			'Receiving question request',
			new HttpError(HttpErrorCode.Socket, 'Your question cannot be empty')
		)

	if (question.length > MAX_QUESTION_LENGTH)
		throw logError(
			'Receiving question request',
			new HttpError(HttpErrorCode.Socket, 'Your question is too long')
		)

	const { current } = game

	if (!current)
		throw logError(
			'Receiving question request',
			new HttpError(HttpErrorCode.Socket, 'The questioner does not exist')
		)

	if (player.id !== current.id)
		throw logError(
			'Receiving question request',
			new HttpError(
				HttpErrorCode.Socket,
				'You are not allowed to ask a question'
			)
		)

	if (game.turn.state !== GameTurnState.Waiting)
		throw logError(
			'Receiving question request',
			new HttpError(HttpErrorCode.Socket, 'Asking is not allowed at this time')
		)

	if (game.turn.question !== null)
		throw logError(
			'Receiving question request',
			new HttpError(
				HttpErrorCode.Socket,
				'A question has already been provided'
			)
		)

	game.turn = {
		state: GameTurnState.Answering,
		question,
		answers: null,
		matches: null,
		correct: null
	}

	game.results.questions.push({
		name: log('Received question', question),
		answers: []
	})
}

export default onQuestion
