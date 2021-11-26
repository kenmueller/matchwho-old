import { Router } from 'express'

import ORIGIN from './origin/index.js'
import HttpError, { HttpErrorCode } from '../shared/error/http.js'
import sendError from './error/send.js'
import log from './log/value.js'
import logError from './log/error.js'

const router = Router()

router.use((req, res, next) => {
	try {
		const host = req.get('host')

		if (!host)
			throw logError(
				'Running origin precheck',
				new HttpError(HttpErrorCode.BadRequest, 'Unable to get host')
			)

		const origin = new URL(req.url, `${req.protocol}://${host}`)
		if (origin.origin === ORIGIN.origin) return next()

		res.redirect(
			HttpErrorCode.PermanentRedirect,
			log(
				'Origin precheck',
				new URL(req.url, ORIGIN).href,
				`redirecting from ${origin.href}`
			)
		)
	} catch (error) {
		sendError(res, logError('Attempted origin precheck', error))
	}
})

router.use((_req, res, next) => {
	try {
		res.header('access-control-allow-origin', ORIGIN.href)
		next()
	} catch (error) {
		sendError(res, logError('Setting headers', error))
	}
})

export default router
