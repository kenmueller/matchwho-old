import { sql } from 'slonik'

import type SavedGame from '../../../shared/game/saved/index.js'
// import pool from '../../pool.js'
// import fromCache from '../../cache/from.js'
import log from '../../log/value.js'

const savedGameExists = async (code: string) => {
	log('Checking if game exists in database', code)

	// const cachedGame = await fromCache<SavedGame>(code)

	// if (cachedGame) {
	// 	log('Found game in cache', cachedGame.code)
	// 	return true
	// }

	// return pool.connect(connection =>
	// 	connection.exists(
	// 		sql`SELECT 1
	// 			FROM games
	// 			WHERE code = ${code}`
	// 	)
	// )

	return false
}

export default savedGameExists
