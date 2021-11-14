import { app } from './root.js'

import security from './security.js'
import createGame from './game/create.js'
import isGameJoinable from './game/joinable.js'
import './game/stream.js'

app.use(security)
app.use(createGame)
app.use(isGameJoinable)

export default app
