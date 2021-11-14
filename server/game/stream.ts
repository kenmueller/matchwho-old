import socket from '../socket.js'
import HttpsError from '../error/https.js'
import closeWithError from '../error/close.js'
import CODE_LENGTH from './code.js'
import Game from './index.js'

socket('/games/:code', (socket, req) => {
	try {
		const { code } = req.params
		const name = req.query.get('name')

		if (!Game.validCode(code))
			throw new HttpsError(1003, `Game codes must be ${CODE_LENGTH} characters`)

		const game = Game.withCode(code)

		if (!game) throw new HttpsError(1003, 'This game does not exist')
		if (!name) throw new HttpsError(1003, 'You must enter a name')

		const player = game.join(socket, name)

		socket.on('close', () => {
			game.leave(player)
		})
	} catch (error) {
		closeWithError(socket, error)
	}
})
