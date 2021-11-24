import type { PoolClient } from 'pg'

import BEGIN from './query/begin.js'
import COMMIT from './query/commit.js'
import ROLLBACK from './query/rollback.js'
import log from '../log/value.js'
import logError from '../log/error.js'

const useTransaction = async <Result>(
	client: PoolClient,
	transform: () => Promise<Result> | Result
) => {
	let result: Result | undefined

	try {
		await client.query(BEGIN)
		result = await transform()
		await client.query(COMMIT)
	} catch (error) {
		await client.query(ROLLBACK)
		throw logError('Attempted using transaction', error)
	}

	return log('Transaction result', result)
}

export default useTransaction
