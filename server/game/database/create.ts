import type { PoolClient } from 'pg'

import type Game from '../index.js'
import useClient from '../../database/client.js'
import useTransaction from '../../database/transaction.js'
import insert from '../../database/query/insert.js'

const createGameInDatabase = (game: Game) =>
	useClient(client => useTransaction(client, () => insertAll(game, client)))

const insertAll = async (game: Game, client: PoolClient) => {
	await insertGame(game, client)

	await Promise.all([
		insertPlayers(game, client),
		insertQuestionsAndAnswers(game, client)
	])
}

const insertGame = (game: Game, client: PoolClient) =>
	client.query(
		insert({ table: 'games', columns: ['code'], values: [game.code] })
	)

const insertPlayers = (game: Game, client: PoolClient) => {
	const { players } = game.results
	if (!players) return

	return client.query(
		insert({
			table: 'players',
			columns: ['game_code', 'id', 'name', 'points'],
			rows: players.map(player => [
				game.code,
				player.id,
				player.name,
				player.points
			])
		})
	)
}

const insertQuestionsAndAnswers = async (game: Game, client: PoolClient) => {
	await insertQuestions(game, client)
	await insertAnswers(game, client)
}

const insertQuestions = (game: Game, client: PoolClient) =>
	client.query(
		insert({
			table: 'questions',
			columns: ['game_code', 'index', 'name'],
			rows: game.results.questions.map(({ name }, index) => [
				game.code,
				index,
				name
			])
		})
	)

const insertAnswers = (game: Game, client: PoolClient) =>
	client.query(
		insert({
			table: 'answers',
			columns: ['game_code', 'question_index', 'index', 'name', 'value'],
			rows: game.results.questions.flatMap(({ answers }, questionIndex) =>
				answers.map(({ name, value }, index) => [
					game.code,
					questionIndex,
					index,
					name,
					value
				])
			)
		})
	)

export default createGameInDatabase
