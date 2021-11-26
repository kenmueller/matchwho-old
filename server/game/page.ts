import { Router } from 'express'

import HttpError, { HttpErrorCode } from '../../shared/error/http.js'
import sendError from '../error/send.js'
import { GAME_META_HEADER } from '../../shared/game/meta.js'
import Game from './index.js'
import getSavedGame from './saved/get.js'
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
				new HttpError(
					HttpErrorCode.BadRequest,
					'Invalid game code, redirecting'
				),
				code
			)

			return res.redirect(HttpErrorCode.PermanentRedirect, '/')
		}

		const game = Game.withCode(code)

		if (game) {
			log('Setting game meta header as game.meta', game.code)
			req.headers[GAME_META_HEADER] = JSON.stringify(game.meta)
		} else {
			log(
				'Intercepting game page request',
				'Game not running, searching in database',
				code
			)

			const game = await getSavedGame(code)

			if (!game) {
				logError(
					'Intercepting game page request',
					new HttpError(
						HttpErrorCode.NotFound,
						'Game not found in database, redirecting'
					),
					code
				)

				return res.redirect(HttpErrorCode.TemporaryRedirect, '/')
			}

			log('Setting game meta header as saved game', game.code)
			req.headers[GAME_META_HEADER] = JSON.stringify(game)
		}

		next()
	} catch (error) {
		sendError(
			res,
			logError('Attempted intercepting game page request', error, code)
		)
	}
})

export default router
