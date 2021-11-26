import { Router } from 'express'

import HttpError, { HttpErrorCode } from '../../shared/error/http.js'
import sendError from '../error/send.js'
import Game from './index.js'
import getSavedGame from './saved/get.js'
import log from '../log/value.js'
import logError from '../log/error.js'

const router = Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/games/:code', async (req, res) => {
	const { code } = req.params

	try {
		if (!Game.validCode(code))
			throw logError(
				'Received game meta request',
				new HttpError(HttpErrorCode.BadRequest, 'Invalid game code'),
				code
			)

		const game = Game.withCode(code)

		if (game) {
			log('Sending game meta as game.meta', game.code)
			res.send(game.meta)
		} else {
			log(
				'Received game meta request',
				'Game not running, searching in database',
				code
			)

			const game = await getSavedGame(code)

			if (!game)
				throw logError(
					'Received game meta request',
					new HttpError(HttpErrorCode.NotFound, 'This game does not exist'),
					code
				)

			log('Sending game meta as saved game', game.code)
			res.send(game)
		}
	} catch (error) {
		sendError(res, logError('Attempted to send game meta', error, code))
	}
})

export default router
