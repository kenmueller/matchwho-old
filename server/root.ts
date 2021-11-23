import express from 'express'
import { Server, createServer } from 'http'

interface GlobalServer {
	server?: Server
}

export const app = express()
export const server = (global as GlobalServer).server ?? createServer(app)
