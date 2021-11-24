import type WebSocket from 'ws'

import close from './close.js'
import log from '../log/value.js'

const PING_INTERVAL = 5000

const keepAlive = (socket: WebSocket) => {
	let alive = true

	const interval = setInterval(() => {
		alive ? socket.ping() : close(socket)
		alive = false
	}, PING_INTERVAL)

	socket.on('pong', () => {
		alive = true
	})

	socket.on('close', () => {
		clearInterval(log('Clearing socket keepalive interval', interval))
	})
}

export default keepAlive
