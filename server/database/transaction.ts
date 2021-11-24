import type { PoolClient } from 'pg'

const useTransaction = async <Result>(
	client: PoolClient,
	transform: () => Promise<Result> | Result
) => {
	let result: Result | undefined

	try {
		await client.query('BEGIN')
		result = await transform()
		await client.query('COMMIT')
	} catch (error) {
		await client.query('ROLLBACK')
		throw error
	}

	return result
}

export default useTransaction
