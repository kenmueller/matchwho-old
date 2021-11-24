import type Game from '../index.js'
import useClient from '../../database/client.js'
import useTransaction from '../../database/transaction.js'

const createGameInDatabase = async (game: Game) => {
	await useClient(async client => {
		await useTransaction(client, async () => {
			await client.query(
				`
				INSERT INTO games 
				`
			)
		})
	})
}

export default createGameInDatabase
