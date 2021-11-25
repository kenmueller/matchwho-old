import type Game from '../index.js'
import useClient from '../../database/client.js'
import update from '../../database/query/update.js'
import log from '../../log/value.js'

const setNextInDatabase = async (game: Game) => {
	const next = game.results.next
	if (!next) return

	log('Setting game.next in database', next, game.code)

	await useClient(client =>
		client.query(
			update({
				table: 'games',
				columns: { next },
				where: ['code = %L', game.code]
			})
		)
	)
}

export default setNextInDatabase
