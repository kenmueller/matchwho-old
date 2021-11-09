import { Router } from 'express'

import sendError from '../error/send.js'
import Game from './index.js'

const router = Router()

router.post('/games', (_req, res) => {
	try {
		res.send(new Game().code)
	} catch (error) {
		sendError(res, error)
	}
})

export default router
