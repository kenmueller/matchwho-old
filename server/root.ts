import express from 'express'
import { createServer } from 'http'

import devServer from './dev/server.js'

export const app = express()
export const server = devServer ?? createServer(app)
