import HttpError, { HttpErrorCode } from '../../../shared/error/http.js'
import type Game from '../index.js'
import type Player from '../player.js'
import GameTurnState from '../../../shared/game/turn/state.js'

const onUnmatch = (game: Game, sender: Player, id: string) => {
	const { current } = game

	if (!current)
		throw new HttpError(HttpErrorCode.Socket, 'The questioner does not exist')

	if (typeof id !== 'string' || id === current.id)
		throw new HttpError(HttpErrorCode.Socket, 'Invalid player')

	const player = game.players.find(player => player.id === id)
	if (!player) throw new HttpError(HttpErrorCode.Socket, 'Unknown player')

	const { matches } = game.turn

	if (!matches)
		throw new HttpError(HttpErrorCode.Socket, 'Unable to load matches')

	if (sender.id !== current.id)
		throw new HttpError(HttpErrorCode.Socket, 'You must be the one matching')

	if (game.turn.state !== GameTurnState.Matching)
		throw new HttpError(
			HttpErrorCode.Socket,
			'Matching is not allowed at this time'
		)

	delete matches[player.id]
}

export default onUnmatch
