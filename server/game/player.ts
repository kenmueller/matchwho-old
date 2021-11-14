import type WebSocket from 'ws'

export default interface Player {
	socket: WebSocket
	name: string
}
