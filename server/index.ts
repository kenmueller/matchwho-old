import { server } from './root.js'

import PORT from './port.js'
import app from './app.js'

import {
	assetsMiddleware,
	prerenderedMiddleware,
	kitMiddleware
	// @ts-ignore
} from '../../build/middlewares.js'

app.set('trust proxy', 1)
app.disable('x-powered-by')

app.use(assetsMiddleware)
app.use(prerenderedMiddleware)
app.use(kitMiddleware)

server.listen(PORT)
