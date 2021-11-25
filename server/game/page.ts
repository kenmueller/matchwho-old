import { Router } from 'express'

import DEV from '../dev/index.js'
import HttpError from '../../shared/error/http.js'
import sendError from '../error/send.js'
import Game from './index.js'
import log from '../log/value.js'
import logError from '../log/error.js'

const VITE_PING = '__vite_ping'

const router = Router()

router.get('/:code', (req, res, next) => {
	const { code } = req.params

	if (DEV && code === VITE_PING) {
		log('Skipping intercepting game page request', VITE_PING, 'dev')
		return
	}

	let didError = false

	try {
		if (!Game.validCode(code)) {
			logError(
				'Intercepting game page request',
				new HttpError(400, 'Invalid game code'),
				code
			)
			return
		}

		const game = Game.withCode(code)

		if (!game) {
			logError(
				'Intercepting game page request',
				new HttpError(404, 'Game not found'),
				code
			)
			return
		}

		req.headers['x-game-meta'] = JSON.stringify(
			log('Setting game meta header', game.meta, game.code)
		)
	} catch (error) {
		didError = true

		sendError(
			res,
			logError('Error intercepting game page request', error, code)
		)
	} finally {
		if (!didError) {
			log('Intercepted game page request', code)
			next()
		}
	}
})

export default router
