import { Router } from 'express'

import ORIGIN from '../origin/index.js'
import CONTENT_SECURITY_POLICY from './content.js'
import HttpError from '../../shared/error/http.js'
import sendError from '../error/send.js'
import log from '../log/value.js'
import logError from '../log/error.js'

const router = Router()

router.use((req, res, next) => {
	try {
		const host = req.get('host')

		if (!host)
			throw logError(
				'Running origin precheck',
				new HttpError(400, 'Unable to get host')
			)

		const origin = `${req.protocol}://${host}`
		if (origin === ORIGIN) return next()

		res.redirect(
			301,
			log(
				'Origin precheck',
				new URL(req.url, ORIGIN).href,
				`redirecting from ${origin}`
			)
		)
	} catch (error) {
		sendError(res, logError('Attempted origin precheck', error))
	}
})

router.use((_req, res, next) => {
	try {
		res.header('content-security-policy', CONTENT_SECURITY_POLICY)
		res.header('access-control-allow-origin', ORIGIN)
		res.header('expect-ct', '0')
		res.header('referrer-policy', 'no-referrer')
		res.header('strict-transport-security', 'max-age=15552000')
		res.header('x-content-type-options', 'nosniff')
		res.header('x-dns-prefetch-control', 'off')
		res.header('x-download-options', 'noopen')
		res.header('x-frame-options', 'SAMEORIGIN')
		res.header('x-permitted-cross-domain-policies', 'none')
		res.header('x-xss-protection', '0')

		next()
	} catch (error) {
		sendError(res, logError('Setting headers', error))
	}
})

export default router