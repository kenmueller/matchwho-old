import type WebSocket from 'ws'

import HttpError from '../../shared/error/http.js'

const closeWithError = (socket: WebSocket, error: unknown) => {
	try {
		socket.close(
			error instanceof HttpError ? error.code : 1011,
			error instanceof Error ? error.message : 'An unknown error occurred'
		)
	} catch (error) {
		console.error(error)
	}
}

export default closeWithError
