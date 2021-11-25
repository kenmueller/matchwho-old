import express from 'express'
import { Server, createServer } from 'http'

import log from './log/value.js'

interface WithDevServer {
	devServer?: Server
}

const { devServer } = global as WithDevServer
log('Dev server exists', Boolean(devServer))

export const app = express()
export const server = devServer ?? createServer(app)
