import { Router } from 'express'

import ORIGIN from './origin.js'

const router = Router()

router.use((_req, res, next) => {
	res.header('Access-Control-Allow-Origin', ORIGIN)
	next()
})

export default router
