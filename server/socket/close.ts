import type WebSocket from 'ws'

import log from '../log/value.js'
import logError from '../log/error.js'

const close = (socket: WebSocket) => {
	try {
		log('Closing socket', socket.readyState)
		socket.close()
	} catch (error) {
		logError('Attempted to close socket', error, socket.readyState)
	}
}

export default close
