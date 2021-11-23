import type WebSocket from 'ws'

const close = (socket: WebSocket) => {
	try {
		socket.close()
	} catch (error) {
		console.error(error)
	}
}

export default close
