import { Router } from 'express'

import HttpError, { HttpErrorCode } from '../../shared/error/http.js'
import sendError from '../error/send.js'
import CODE_LENGTH from '../../shared/game/code.js'
import Game from './index.js'
import log from '../log/value.js'
import logError from '../log/error.js'

const router = Router()

router.get('/games/:code', (req, res) => {
	const { code } = req.params

	try {
		if (!Game.validCode(code))
			throw logError(
				'Received game meta request',
				new HttpError(
					HttpErrorCode.BadRequest,
					`Game codes must be ${CODE_LENGTH} characters`
				)
			)

		const game = Game.withCode(code)

		if (!game)
			throw logError(
				'Received game meta request',
				new HttpError(HttpErrorCode.NotFound, 'This game does not exist')
			)

		res.send(log('Sent game meta', game.meta, game.code))
	} catch (error) {
		sendError(res, logError('Attempted to send game meta', error, code))
	}
})

export default router
