import { Router } from 'express'

import HttpError from '../../shared/error/http.js'
import sendError from '../error/send.js'
import CODE_LENGTH from '../../shared/game/code.js'
import Game from './index.js'

const router = Router()

router.get('/games/:code', (req, res) => {
	try {
		const { code } = req.params

		if (!Game.validCode(code))
			throw new HttpError(400, `Game codes must be ${CODE_LENGTH} characters`)

		const game = Game.withCode(code)
		if (!game) throw new HttpError(404, 'This game does not exist')

		res.send(game.meta)
	} catch (error) {
		sendError(res, error)
	}
})

export default router
