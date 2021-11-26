import { Router } from 'express'

import ORIGIN from '../origin/index.js'
import HttpError from '../../shared/error/http.js'
import sendError from '../error/send.js'
import Game from './index.js'
import log from '../log/value.js'
import logError from '../log/error.js'

const RESERVED_CODES = ['__vite_ping', 'favicon.ico']

const router = Router()

router.get('/:code', (req, res, next) => {
	const { code } = req.params

	if (RESERVED_CODES.includes(code)) {
		log('Skipping intercepting game page request', code)
		return
	}

	try {
		if (!Game.validCode(code)) {
			logError(
				'Intercepting game page request',
				new HttpError(400, 'Invalid game code, redirecting'),
				code
			)

			return res.redirect(301, ORIGIN.href)
		}

		const game = Game.withCode(code)

		if (!game) {
			logError(
				'Intercepting game page request',
				new HttpError(404, 'Game not found'),
				code
			)

			return next()
		}

		req.headers['x-game-meta'] = JSON.stringify(
			log('Setting game meta header', game.meta, game.code)
		)

		next()
	} catch (error) {
		sendError(
			res,
			logError('Attempted intercepting game page request', error, code)
		)
	}
})

export default router
