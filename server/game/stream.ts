import socket from '../socket.js'
import HttpError, { HttpErrorCode } from '../../shared/error/http.js'
import keepAlive from '../socket/alive.js'
import closeWithError from '../error/close.js'
import CODE_LENGTH from '../../shared/game/code.js'
import Game from './index.js'
import type ClientGameData from '../../shared/game/data/client.js'
import log from '../log/value.js'
import logError from '../log/error.js'

socket('/games/:code', (socket, req) => {
	const { code } = req.params

	try {
		const name = req.query.get('name')?.trim() ?? ''

		if (!Game.validCode(code))
			throw logError(
				'Receiving socket request',
				new HttpError(
					HttpErrorCode.Socket,
					`Game codes must be ${CODE_LENGTH} characters`
				),
				code
			)

		const game = Game.withCode(code)

		if (!game)
			throw logError(
				'Receiving socket request',
				new HttpError(HttpErrorCode.Socket, 'This game does not exist'),
				code
			)

		const player = game.join(socket, name)

		keepAlive(socket)

		socket.on('message', (data, isBinary) => {
			try {
				if (player.spectating)
					throw logError(
						'Receiving socket message',
						new HttpError(
							1003,
							'You cannot interact with the game while spectating'
						),
						game.code
					)

				const message = log(
					'Received socket message',
					JSON.parse(
						data.toString(isBinary ? 'binary' : 'utf8')
					) as ClientGameData | null,
					game.code
				)

				if (typeof message?.key !== 'string')
					throw logError(
						'Receiving socket message',
						new HttpError(HttpErrorCode.Socket, 'Invalid data'),
						game.code
					)

				game.onMessage(player, message)
			} catch (error) {
				closeWithError(
					socket,
					logError('Attempted to receive socket message', error, game.code)
				)
			}
		})

		socket.on('close', () => {
			try {
				game.leave(player)
			} catch (error) {
				logError('Received close socket request', error, game.code)
			}
		})
	} catch (error) {
		closeWithError(
			socket,
			logError('Attempted to keep socket open', error, code)
		)
	}
})
