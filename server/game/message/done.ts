import HttpError, { HttpErrorCode } from '../../../shared/error/http.js'
import type Game from '../index.js'
import type Player from '../player.js'
import GameTurnState from '../../../shared/game/turn/state.js'
import log from '../../log/value.js'
import logError from '../../log/error.js'

const onDone = (game: Game, player: Player) => {
	const { current } = game

	if (!current)
		throw logError(
			'Receiving done request',
			new HttpError(HttpErrorCode.Socket, 'The questioner does not exist')
		)

	if (player.id !== current.id)
		throw logError(
			'Receiving done request',
			new HttpError(HttpErrorCode.Socket, 'You must be the one matching')
		)

	if (game.turn.state !== GameTurnState.Matching)
		throw logError(
			'Receiving done request',
			new HttpError(
				HttpErrorCode.Socket,
				'Matching is not allowed at this time'
			)
		)

	if (!game.turn.correct)
		throw logError(
			'Receiving done request',
			new HttpError(
				HttpErrorCode.Socket,
				'You must have seen the correct matches before continuing'
			)
		)

	const range = log('Done request range', {
		index: ++game.index,
		players: game.players.length
	})

	if (range.index >= range.players) game.nextRound()
	game.resetTurn()
}

export default onDone
