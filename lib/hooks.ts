import type { GetSession } from '@sveltejs/kit'

import type Session from './session.js'

const getGameMeta = (value: string) => {
	try {
		return JSON.parse(value)
	} catch {
		return null
	}
}

export const getSession: GetSession<
	Record<string, never>,
	unknown,
	Session
> = req => ({
	gameMeta: getGameMeta(req.headers['x-game-meta'])
})
