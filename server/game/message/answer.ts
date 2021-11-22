import HttpError, { HttpErrorCode } from '../../../shared/error/http.js'
import GameTurnState from '../../../shared/game/turn/state.js'
import MAX_ANSWER_LENGTH from '../../../shared/game/answer.js'
import type Game from '../index.js'
import type Player from '../player.js'

const onAnswer = (game: Game, player: Player, value: string) => {
	if (typeof value !== 'string')
		throw new HttpError(HttpErrorCode.Socket, 'Invalid answer')

	const answer = value.trim()

	if (!answer)
		throw new HttpError(HttpErrorCode.Socket, 'Your answer cannot be empty')

	if (answer.length > MAX_ANSWER_LENGTH)
		throw new HttpError(HttpErrorCode.Socket, 'Your answer is too long')

	const { current } = game

	if (!current)
		throw new HttpError(HttpErrorCode.Socket, 'The questioner does not exist')

	if (player.id === current.id)
		throw new HttpError(
			HttpErrorCode.Socket,
			'You cannot answer your own question'
		)

	if (game.turn.state !== GameTurnState.Answering)
		throw new HttpError(
			HttpErrorCode.Socket,
			'Answering is not allowed at this time'
		)

	if (player.answer !== null)
		throw new HttpError(
			HttpErrorCode.Socket,
			'An answer has already been provided'
		)

	player.answer = answer
	const { answers } = game

	if (answers)
		game.turn = {
			...game.turn,
			state: GameTurnState.Matching,
			answers,
			matches: {}
		}
}

export default onAnswer
