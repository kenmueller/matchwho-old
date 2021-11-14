import type { GetSession } from '@sveltejs/kit'

import type Session from './session'
import parse from './parse'

export const getSession: GetSession<
	Record<string, never>,
	unknown,
	Session
> = req => ({
	gameMeta: parse(req.headers['x-game-meta'])
})
