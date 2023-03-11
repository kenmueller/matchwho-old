import { DatabaseTransactionConnectionType, sql } from 'slonik'

import type Game from '../index.js'
// import pool from '../../pool.js'
// import cacheGame from './cache.js'
import log from '../../log/value.js'

const saveGame = async (game: Game) => {
	log('Creating game in database', game.code)

	// await pool.connect(async connection => {
	// 	await connection.transaction(async connection => {
	// 		await connection.query(
	// 			sql`INSERT INTO
	// 				games (code, next)
	// 				VALUES (${game.code}, ${game.results.next})`
	// 		)

	// 		await saveBranches(game, connection)
	// 	})
	// })

	// void cacheGame(game.saved)
}

const saveBranches = async (
	game: Game,
	connection: DatabaseTransactionConnectionType
) => {
	await Promise.all([
		savePlayers(game, connection),
		saveResults(game, connection)
	])
}

const savePlayers = async (
	game: Game,
	connection: DatabaseTransactionConnectionType
) => {
	const { players } = game.results
	if (!players) return

	await connection.query(
		sql`INSERT INTO
			players (game_code, id, name, points)
			VALUES ${sql.join(
				players.map(
					({ id, name, points }) =>
						sql`(${sql.join([game.code, id, name, points], sql`, `)})`
				),
				sql`, `
			)}`
	)
}

const saveResults = async (
	game: Game,
	connection: DatabaseTransactionConnectionType
) => {
	const { questions } = game.results

	await connection.query(
		sql`INSERT INTO
			questions (game_code, index, name, question)
			VALUES ${sql.join(
				questions.map(
					({ name, question }, index) =>
						sql`(${sql.join([game.code, index, name, question], sql`, `)})`
				),
				sql`, `
			)}`
	)

	await connection.query(
		sql`INSERT INTO
			answers (game_code, question_index, index, name, answer)
			VALUES ${sql.join(
				questions.flatMap(({ answers }, questionIndex) =>
					answers.map(
						({ name, answer }, index) =>
							sql`(${sql.join(
								[game.code, questionIndex, index, name, answer],
								sql`, `
							)})`
					)
				),
				sql`, `
			)}`
	)
}

export default saveGame
