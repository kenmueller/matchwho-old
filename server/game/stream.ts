import socket from '../socket.js'
// import HttpsError from '../error/https.js'
// import closeWithError from '../error/close.js'
// import CODE_LENGTH from './code.js'
// import Game from './index.js'

socket('/games/:code', (socket, req) => {
	socket.on('message', (message, isBinary) => {
		socket.send(message.toString(isBinary ? 'binary' : 'utf8'))
	})
})

// router.ws('/games/:code', (socket, req) => {
// 	try {
// 		const { code } = req.params
// 		console.log('JOINED:', code)

// 		if (!Game.validCode(code))
// 			throw new HttpsError(1003, `Game codes must be ${CODE_LENGTH} characters`)

// 		const game = Game.withCode(code)
// 		if (!game) throw new HttpsError(1003, 'This game does not exist')
// 	} catch (error) {
// 		closeWithError(socket, error)
// 	}
// })
