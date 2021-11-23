import HttpError, { HttpErrorCode } from '../../../shared/error/http.js'
import GameState from '../../../shared/game/state.js'
import { MIN_PLAYERS } from '../../../shared/game/player/bounds.js'
import type Game from '../index.js'
import type Player from '../player.js'

const onStart = (game: Game, player: Player) => {
	if (game.players.length < MIN_PLAYERS)
		throw new HttpError(
			HttpErrorCode.Socket,
			'The game does not have enough players'
		)

	if (game.state !== GameState.Joining)
		throw new HttpError(HttpErrorCode.Socket, 'The game has already started')

	if (player.id !== game.leader?.id)
		throw new HttpError(
			HttpErrorCode.Socket,
			'You must be the leader to start the game'
		)

	game.state = GameState.Started
}

export default onStart
