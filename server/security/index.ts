import { Router } from 'express'

import ORIGIN from '../origin/index.js'
import CONTENT_SECURITY_POLICY from './content.js'
import sendError from '../error/send.js'

const router = Router()

router.use((req, res, next) => {
	try {
		;`${req.protocol}://${req.get('host')}` === ORIGIN
			? next()
			: res.redirect(301, new URL(req.url, ORIGIN).href)
	} catch (error) {
		sendError(res, error)
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
		sendError(res, error)
	}
})

export default router
