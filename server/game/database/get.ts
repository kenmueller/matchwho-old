import { sql } from 'slonik'

import type GameFromDatabase from './index.js'
import type PlayerFromDatabase from './player.js'
import TOP_PLAYERS from '../../../shared/game/player/top.js'
import pool from '../../pool.js'
import log from '../../log/value.js'

const getGameFromDatabase = (code: string) => {
	log('Fetching game from database', code)

	return pool.connect(async connection => {
		const games = (await connection.any(
			sql`SELECT next, completed
				FROM games
				WHERE code = ${code}`
		)) as GameFromDatabase[]

		const game = games[0]
		if (!game) return null

		game.code = code

		game.players = (await connection.any(
			sql`SELECT id, name, points
				FROM players
				WHERE game_code = ${game.code}
				ORDER BY points DESC
				LIMIT ${TOP_PLAYERS}`
		)) as PlayerFromDatabase[]

		return game
	})
}

export default getGameFromDatabase
