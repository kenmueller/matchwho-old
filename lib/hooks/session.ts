import type { GetSession } from '@sveltejs/kit'

import type Session from '../session.js'
import { GAME_META_HEADER } from '../../shared/game/meta.js'
import parseGameMeta from '../meta/parse.js'

const getSession: GetSession<
	Record<string, never>,
	unknown,
	Session
> = req => ({
	gameMeta: parseGameMeta(req.headers[GAME_META_HEADER])
})

export default getSession
