import WebSocket, { WebSocketServer } from 'ws'
import type { IncomingMessage } from 'http'
import type { Socket } from 'net'
import Pattern from 'url-pattern'

import { server } from './root.js'
import DEV from './dev/index.js'
import ORIGIN from './origin/index.js'
import HttpError, { HttpErrorCode } from '../shared/error/http.js'
import log from './log/value.js'
import logError from './log/error.js'

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
		const { origin, pathname, searchParams } = new URL(
			req.url ?? '',
			req.headers.origin
		)

		log('Receiving upgrade request', {
			origin,
			pathname,
			searchParams: searchParams.toString()
		})

		if (origin !== ORIGIN)
			throw logError(
				'Receiving upgrade request',
				new HttpError(HttpErrorCode.Socket, 'Invalid origin'),
				origin
			)

		if (DEV && pathname === '/') {
			log('Skipping upgrade request', pathname, 'dev')
			return
		}

		for (const [pattern, socketServer] of socketServers) {
			const params = pattern.match(pathname) as Record<string, string> | null
			if (!params) continue

			req.params = params
			req.query = searchParams

			const client = await new Promise<WebSocket>(resolve => {
				socketServer.handleUpgrade(req, socket, head, resolve)
			})

			socketServer.emit('connection', client, req)
			log('Found socket server', pathname)

			return
		}

		throw logError(
			'Receiving upgrade request',
			new HttpError(HttpErrorCode.Socket, 'No matching paths'),
			pathname
		)
	} catch (error) {
		logError(
			'Attempted to handle upgrade request',
			error,
			req.url ?? 'unknown url'
		)

		socket.destroy(error instanceof Error ? error : undefined)
	}
}

server.on('upgrade', (req, socket, head) => {
	upgrade(req as SocketRequest, socket as Socket, head).catch(error => {
		logError('Failed upgrade request', error, req.url ?? 'unknown url')
	})
})

export default socket
