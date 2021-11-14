import type { WebSocket } from 'ws'

import HttpsError from './https.js'

const closeWithError = (socket: WebSocket, error: unknown) => {
	socket.close(
		error instanceof HttpsError ? error.code : 1011,
		error instanceof Error ? error.message : 'An unknown error occurred'
	)
}

export default closeWithError
