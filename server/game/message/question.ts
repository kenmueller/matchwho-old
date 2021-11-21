import HttpError, { HttpErrorCode } from '../../../shared/error/http.js'
import GameTurnState from '../../../shared/game/turn/state.js'
import type Game from '../index.js'
import type Player from '../player.js'

const onQuestion = (game: Game, player: Player, value: string) => {
	if (typeof value !== 'string')
		throw new HttpError(HttpErrorCode.Socket, 'Invalid question')

	const question = value.trim()

	if (!question)
		throw new HttpError(HttpErrorCode.Socket, 'Your question cannot be empty')

	const { current } = game

	if (!current)
		throw new HttpError(HttpErrorCode.Socket, 'The questioner does not exist')

	if (player.id !== current.id)
		throw new HttpError(
			HttpErrorCode.Socket,
			'You are not allowed to ask a question'
		)

	if (game.turn.state !== GameTurnState.Waiting)
		throw new HttpError(
			HttpErrorCode.Socket,
			'Asking is not allowed at this time'
		)

	if (game.turn.question !== null)
		throw new HttpError(
			HttpErrorCode.Socket,
			'A question has already been provided'
		)

	game.turn = {
		state: GameTurnState.Answering,
		question,
		answers: null,
		matches: null
	}
}

export default onQuestion
