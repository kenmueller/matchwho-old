import type { GetSession } from '@sveltejs/kit'

import type Session from './session.js'
import type GameMeta from '../shared/game/meta.js'

const getGameMeta = (value: string) => {
	try {
		return JSON.parse(value) as GameMeta | null
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
