import HttpError, { HttpErrorCode } from '../../../shared/error/http.js'
import GameState from '../../../shared/game/state.js'
import Game from '../index.js'
import type Player from '../player.js'
import log from '../../log/value.js'
import logError from '../../log/error.js'

const onNext = (game: Game, player: Player) => {
	if (game.state !== GameState.Completed)
		throw logError(
			'Receiving next game request',
			new HttpError(HttpErrorCode.Socket, 'The game has not been completed')
		)

	if (game.results.next !== null)
		throw logError(
			'Receiving next game request',
			new HttpError(HttpErrorCode.Socket, 'There is already a next game')
		)

	if (player.id !== game.leader?.id)
		throw logError(
			'Receiving next game request',
			new HttpError(
				HttpErrorCode.Socket,
				'You must be the leader to create the next game'
			)
		)

	game.results.next = log('Next game', new Game().code)
}

export default onNext
