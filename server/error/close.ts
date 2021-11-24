import type WebSocket from 'ws'

import HttpError from '../../shared/error/http.js'
import logError from '../log/error.js'

const closeWithError = (socket: WebSocket, error: unknown) => {
	try {
		logError('Closing socket with error', error)

		socket.close(
			error instanceof HttpError ? error.code : 1011,
			error instanceof Error ? error.message : 'An unknown error occurred'
		)
	} catch (error) {
		logError('Attempted to close socket with error', error)
	}
}

export default closeWithError
