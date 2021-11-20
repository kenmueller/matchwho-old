import socket from '../socket.js'
import HttpsError from '../../shared/error/https.js'
import closeWithError from '../error/close.js'
import CODE_LENGTH from '../../shared/game/code.js'
import Game from './index.js'
import GameState from '../../shared/game/state.js'
import type ClientGameData from '../../shared/game/data/client.js'

socket('/games/:code', (socket, req) => {
	try {
		const { code } = req.params
		const name = req.query.get('name') ?? ''

		if (!Game.validCode(code))
			throw new HttpsError(1003, `Game codes must be ${CODE_LENGTH} characters`)

		const game = Game.withCode(code)
		if (!game) throw new HttpsError(1003, 'This game does not exist')

		if (game.state === GameState.Completed)
			throw new HttpsError(1003, 'This game has already ended')

		const player = game.join(socket, name)

		socket.on('message', (data, isBinary) => {
			try {
				if (player.spectating)
					throw new HttpsError(
						1003,
						'You cannot interact with the game while spectating'
					)

				const message: ClientGameData | null = JSON.parse(
					data.toString(isBinary ? 'binary' : 'utf8')
				)

				if (typeof message?.key !== 'string')
					throw new HttpsError(1003, 'Invalid data')

				game.onMessage(player, message)
			} catch (error) {
				closeWithError(socket, error)
			}
		})

		socket.on('close', () => {
			game.leave(player)
		})
	} catch (error) {
		closeWithError(socket, error)
	}
})
