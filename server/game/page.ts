import { Router } from 'express'

import HttpError from '../../shared/error/http.js'
import sendError from '../error/send.js'
import Game from './index.js'
import getGameFromDatabase from './database/get.js'
import log from '../log/value.js'
import logError from '../log/error.js'

const RESERVED_CODES = ['__vite_ping', 'favicon.ico']

const router = Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/:code', async (req, res, next) => {
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

			return res.redirect(301, '/')
		}

		const game = Game.withCode(code)

		if (!game) {
			log(
				'Intercepting game page request',
				'Game not running, searching in database',
				code
			)

			const game = await getGameFromDatabase(code)

			if (!game) {
				logError(
					'Intercepting game page request',
					new HttpError(404, 'Game not found in database, redirecting'),
					code
				)

				return res.redirect(307, '/')
			}

			log('Sending game from database', game.code)
			return res.send(game)
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
