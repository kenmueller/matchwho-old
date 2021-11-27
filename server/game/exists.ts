import { Router } from 'express'

import HttpError, { HttpErrorCode } from '../../shared/error/http.js'
import sendError from '../error/send.js'
import Game from './index.js'
import logError from '../log/error.js'

const router = Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/games/:code/exists', async (req, res) => {
	const { code } = req.params

	try {
		if (!Game.validCode(code))
			throw logError(
				'Received game meta request',
				new HttpError(HttpErrorCode.BadRequest, 'Invalid game code'),
				code
			)

		res.send(await Game.exists(code))
	} catch (error) {
		sendError(res, logError('Attempted to check if game exists', error, code))
	}
})

export default router
