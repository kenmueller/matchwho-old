import WebSocket, { WebSocketServer } from 'ws'
import type { IncomingMessage } from 'http'
import type { Socket } from 'net'
import Pattern from 'url-pattern'

import { server } from './root.js'
import DEV from './dev.js'
import ORIGIN from './origin/index.js'
import HttpError, { HttpErrorCode } from '../shared/error/http.js'
import log from './log/value.js'
import logError from './log/error.js'

type URLParams = Record<string, string>

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

	log('Created socket route', path)
}

const upgrade = async (req: SocketRequest, socket: Socket, head: Buffer) => {
	try {
		const origin = new URL(req.url ?? '', req.headers.origin)
		log('Receiving upgrade request', origin.href)

		if (origin.origin !== ORIGIN.origin)
			throw logError(
				'Receiving upgrade request',
				new HttpError(HttpErrorCode.Socket, 'Invalid origin'),
				origin.origin
			)

		if (DEV && origin.pathname === '/') {
			log('Skipping upgrade request', origin.pathname, 'dev')
			return
		}

		for (const [pattern, socketServer] of socketServers) {
			const params = pattern.match(origin.pathname) as URLParams | null
			if (!params) continue

			req.params = params
			req.query = origin.searchParams

			const client = await new Promise<WebSocket>(resolve => {
				socketServer.handleUpgrade(req, socket, head, resolve)
			})

			socketServer.emit('connection', client, req)
			log('Found socket server', origin.pathname)

			return
		}

		throw logError(
			'Receiving upgrade request',
			new HttpError(HttpErrorCode.Socket, 'No matching paths'),
			origin.pathname
		)
	} catch (error) {
		logError('Attempted to handle upgrade request', error, req.url)
		socket.destroy(error instanceof Error ? error : undefined)
	}
}

server.on('upgrade', (req, socket, head) => {
	upgrade(req as SocketRequest, socket as Socket, head).catch(error => {
		logError('Failed upgrade request', error, req.url)
	})
})

export default socket
