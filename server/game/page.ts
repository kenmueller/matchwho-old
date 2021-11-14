import { Router } from 'express'

import sendError from '../error/send.js'
import Game from './index.js'

const router = Router()

router.get('/:code', (req, res, next) => {
	try {
		const { code } = req.params
		if (!Game.validCode(code)) return next()

		const game = Game.withCode(code)
		if (!game) return next()

		req.headers['x-game-meta'] = JSON.stringify(game.meta)
		next()
	} catch (error) {
		sendError(res, error)
	}
})

export default router
