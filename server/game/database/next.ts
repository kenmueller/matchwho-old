import { sql } from 'slonik'

import type Game from '../index.js'
import pool from '../../pool.js'
import log from '../../log/value.js'

const setNextInDatabase = async (game: Game) => {
	const { next } = game.results
	if (!next) return

	log('Setting game.next in database', next, game.code)

	await pool.connect(async connection => {
		await connection.query(
			sql`UPDATE games SET next = ${next} WHERE code = ${game.code}`
		)
	})
}

export default setNextInDatabase
