import type { GetSession } from '@sveltejs/kit'

import type Locals from '../locals.js'
import type Session from '../session.js'
import parseGameMeta from '../meta/parse.js'

const getSession: GetSession<Locals, unknown, Session> = req => ({
	gameMeta: parseGameMeta(req.headers['x-game-meta'])
})

export default getSession
