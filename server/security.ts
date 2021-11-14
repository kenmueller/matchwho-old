import { Router } from 'express'

import ORIGIN from './origin.js'
import sendError from './error/send.js'

const router = Router()

router.use((_req, res, next) => {
	try {
		res.header('Access-Control-Allow-Origin', ORIGIN)
		next()
	} catch (error) {
		sendError(res, error)
	}
})

export default router
