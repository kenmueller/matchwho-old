import { app } from './root.js'

import security from './security.js'
import createGame from './game/create.js'
import gamePage from './game/page.js'
import gameMeta from './game/meta.js'
import './game/stream.js'

app.use(security)
app.use(createGame)
app.use(gamePage)
app.use(gameMeta)

export default app
