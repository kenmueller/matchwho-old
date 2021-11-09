import express from 'express'

import security from './security.js'
import createGame from './game/create.js'
import isGameJoinable from './game/joinable.js'

const app = express()

app.use(security)
app.use(createGame)
app.use(isGameJoinable)

export default app
