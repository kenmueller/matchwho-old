import WebSocket, { WebSocketServer } from 'ws'
import type { IncomingMessage } from 'http'
import type { Socket } from 'net'
import Pattern from 'url-pattern'

import { server } from './root.js'
import DEV from './dev.js'
import ORIGIN from './origin.js'
import HttpError from '../shared/error/http.js'

export interface SocketRequest extends IncomingMessage {
	params: Record<string, string>
	query: URLSearchParams
}

export type SocketListener = (socket: WebSocket, req: SocketRequest) => void

const socketServers = new Map<Pattern, WebSocketServer>()

const socket = (path: string, listener: SocketListener) => {
	const socketServer = new WebSocketServer({ noServer: true })
	socketServer.on('connection', listener)

	socketServers.set(new Pattern(path), socketServer)
}

server.on('upgrade', async (req: SocketRequest, socket: Socket, head) => {
	try {
		const { origin, pathname, searchParams } = new URL(
			req.url ?? '',
			req.headers.origin
		)

		if (origin !== ORIGIN) throw new HttpError(1003, 'Invalid origin')
		if (DEV && pathname === '/') return

		for (const [pattern, socketServer] of socketServers) {
			const params: Record<string, string> | null = pattern.match(pathname)
			if (!params) continue

			req.params = params
			req.query = searchParams

			const client = await new Promise<WebSocket>(resolve => {
				socketServer.handleUpgrade(req, socket, head, resolve)
			})

			socketServer.emit('connection', client, req)
			return
		}

		throw new HttpError(1003, 'No matching paths')
	} catch (error) {
		try {
			socket.destroy(error instanceof Error ? error : undefined)
		} catch (error) {
			console.error(error)
		}
	}
})

export default socket
