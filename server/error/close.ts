import type WebSocket from 'ws'

import HttpsError from '../../shared/error/https.js'

const closeWithError = (socket: WebSocket, error: unknown) => {
	try {
		socket.close(
			error instanceof HttpsError ? error.code : 1011,
			error instanceof Error ? error.message : 'An unknown error occurred'
		)
	} catch (error) {
		console.error(error)
	}
}

export default closeWithError
