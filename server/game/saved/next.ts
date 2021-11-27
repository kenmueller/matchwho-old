import { sql } from 'slonik'

import type SavedGame from '../../../shared/game/saved/index.js'
import pool from '../../pool.js'
import cacheGame from './cache.js'
import log from '../../log/value.js'

const saveGameNext = async (game: SavedGame) => {
	log('Setting game.next in database', game.next, game.code)

	await pool.connect(async connection => {
		await connection.query(
			sql`UPDATE games
				SET next = ${game.next}
				WHERE code = ${game.code}`
		)
	})

	void cacheGame(game)
}

export default saveGameNext
