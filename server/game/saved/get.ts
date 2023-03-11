import { sql } from 'slonik'

import Game from '../index.js'
import type SavedGame from '../../../shared/game/saved/index.js'
import type RawSavedAnswer from './answer.js'
import TOP_PLAYERS from '../../../shared/game/player/top.js'
// import pool from '../../pool.js'
// import fromCache from '../../cache/from.js'
// import cacheGame from './cache.js'
import log from '../../log/value.js'
import saveGameNext from './next.js'

const getSavedGame = async (code: string) => {
	log('Fetching game from database', code)

	return null as SavedGame | null

	let game: SavedGame | null = null
	let cached = false

	// game = await fromCache<SavedGame>(code)

	// if (game) {
	// 	log('Found game in cache', game.code)
	// 	cached = true
	// }

	// game = await pool.connect(async connection => {
	// 	const games = await connection.any<SavedGame>(
	// 		sql`SELECT next
	// 			FROM games
	// 			WHERE code = ${code}`
	// 	)

	// 	const game = games[0]
	// 	if (!game) return null

	// 	game.code = code

	// 	game.players = (await connection.any(
	// 		sql`SELECT id, name, points
	// 			FROM players
	// 			WHERE game_code = ${game.code}
	// 			ORDER BY points DESC
	// 			LIMIT ${TOP_PLAYERS}`
	// 	)) as typeof game.players

	// 	game.questions = (await connection.any(
	// 		sql`SELECT name, question
	// 			FROM questions
	// 			WHERE game_code = ${game.code}
	// 			ORDER BY index`
	// 	)) as typeof game.questions

	// 	const answers = await connection.any<RawSavedAnswer>(
	// 		sql`SELECT question_index, name, answer
	// 			FROM answers
	// 			WHERE game_code = ${game.code}
	// 			ORDER BY index`
	// 	)

	// 	for (const { question_index, ...answer } of answers) {
	// 		const question = game.questions[question_index]
	// 		question && (question.answers ??= []).push(answer)
	// 	}

	// 	return game
	// })

	// if (!game) return

	// if (game.next !== null && !(await Game.exists(game.next))) {
	// 	log('game.next no longer exists, deleting', game.next, game.code)

	// 	// game.next no longer exists
	// 	game.next = null

	// 	// Caches the game automatically
	// 	await saveGameNext(game)
	// } else if (!cached) {
	// 	// Game was retrieved from the database
	// 	void cacheGame(game)
	// }

	// return game
}

export default getSavedGame
