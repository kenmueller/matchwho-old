import HttpError, { HttpErrorCode } from '../../../shared/error/http.js'
import GameState from '../../../shared/game/state.js'
import type ServerGameData from '../../../shared/game/data/server.js'
import Game from '../index.js'
import type Player from '../player.js'
import saveGameNext from '../saved/next.js'
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

	const data = JSON.stringify({
		key: 'next',
		value: game.results.next
	} as ServerGameData)

	for (const player of [...game.players, ...game.spectators])
		player.socket.send(data)

	saveGameNext(game.saved)
		.then(() => {
			log('Set game.next in database', game.results.next, game.code)
		})
		.catch(error => {
			logError('Attempted to set game.next in database', error, game.code)
		})
}

export default onNext
