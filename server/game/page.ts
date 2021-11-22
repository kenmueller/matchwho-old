import { Router } from 'express'

import sendError from '../error/send.js'
import Game from './index.js'

const router = Router()

router.get('/:code', (req, res, next) => {
	let didError = false

	try {
		const { code } = req.params
		if (!Game.validCode(code)) return

		const game = Game.withCode(code)
		if (!game) return

		req.headers['x-game-meta'] = JSON.stringify(game.meta)
	} catch (error) {
		didError = true
		sendError(res, error)
	} finally {
		if (didError) return
		next()
	}
})

export default router
