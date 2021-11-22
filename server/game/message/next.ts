import HttpError, { HttpErrorCode } from '../../../shared/error/http.js'
import type Game from '../index.js'
import type Player from '../player.js'
import GameTurnState from '../../../shared/game/turn/state.js'

const onNext = (game: Game, player: Player) => {
	const { current } = game

	if (!current)
		throw new HttpError(HttpErrorCode.Socket, 'The questioner does not exist')

	if (player.id !== current.id)
		throw new HttpError(HttpErrorCode.Socket, 'You must be the one matching')

	if (game.turn.state !== GameTurnState.Matching)
		throw new HttpError(
			HttpErrorCode.Socket,
			'Matching is not allowed at this time'
		)

	if (!game.turn.correctMatches)
		throw new HttpError(
			HttpErrorCode.Socket,
			'You must have seen the correct matches before continuing'
		)

	if (++game.index >= game.players.length) game.nextRound()
	game.resetTurn()
}

export default onNext
