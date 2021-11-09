import { Router } from 'express'

import Game from './index.js'

const router = Router()

router.post('/games', (_req, res) => {
	res.send(new Game().id)
})

export default router
