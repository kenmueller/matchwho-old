import { sql } from 'slonik'
import Cache from 'node-cache'

import type SavedGame from '../../../shared/game/saved/index.js'
import type RawSavedAnswer from './answer.js'
import TOP_PLAYERS from '../../../shared/game/player/top.js'
import pool from '../../pool.js'
import log from '../../log/value.js'
import logError from '../../log/error.js'

const cache = new Cache({
	stdTTL: 10 * 60,
	checkperiod: 10 * 60,
	useClones: false
})

const getSavedGame = (code: string) => {
	log('Fetching game from database', code)

	const cachedGame = cache.get<SavedGame>(code)

	if (cachedGame) {
		log('Found game in cache', cachedGame.code)
		return cachedGame
	}

	return pool.connect(async connection => {
		const games = await connection.any<SavedGame>(
			sql`SELECT next, completed
				FROM games
				WHERE code = ${code}`
		)

		const game = games[0]
		if (!game) return null

		game.code = code

		game.players = (await connection.any(
			sql`SELECT id, name, points
				FROM players
				WHERE game_code = ${game.code}
				ORDER BY points DESC
				LIMIT ${TOP_PLAYERS}`
		)) as typeof game.players

		game.questions = (await connection.any(
			sql`SELECT name, question
				FROM questions
				WHERE game_code = ${game.code}
				ORDER BY index`
		)) as typeof game.questions

		const answers = await connection.any<RawSavedAnswer>(
			sql`SELECT question_index, name, answer
				FROM answers
				WHERE game_code = ${game.code}
				ORDER BY index`
		)

		for (const { question_index, ...answer } of answers) {
			const question = game.questions[question_index]
			question && (question.answers ??= []).push(answer)
		}

		if (!cache.set(game.code, game))
			logError('Attempted to cache game', game.code)

		return game
	})
}

export default getSavedGame
