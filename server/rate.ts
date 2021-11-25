import type { RequestHandler } from 'express'
import middleware from 'express-rate-limit'

import DEV from './dev.js'

/**
 * Disabled in development.
 *
 * @param frame The time frame in minutes.
 * @param max The max number of requests in the time frame.
 */
const rateLimit = (frame: number, max: number) =>
	DEV
		? identity
		: (middleware({ windowMs: frame * 60 * 1000, max }) as RequestHandler)

const identity: RequestHandler = (_req, _res, next) => next()

export default rateLimit
