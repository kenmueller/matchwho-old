import express from 'express'

import security from './security.js'
import createGame from './game/create.js'

const app = express()

app.use(security)
app.use(createGame)

export default app
