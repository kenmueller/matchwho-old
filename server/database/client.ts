import type { PoolClient } from 'pg'

import pool from './pool.js'
import logError from '../log/error.js'

const useClient = async <Result>(
	transform: (client: PoolClient) => Promise<Result> | Result
) => {
	const client = await pool.connect()
	let transformError: unknown

	try {
		return await transform(client)
	} catch (error) {
		transformError = error
		throw logError('Attempted using client', error)
	} finally {
		client.release(
			transformError instanceof Error
				? transformError
				: transformError !== undefined
		)
	}
}

export default useClient
