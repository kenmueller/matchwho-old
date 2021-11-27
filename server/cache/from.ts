import client from './client.js'
import logError from '../log/error.js'

const fromCache = async <Value>(key: string) => {
	try {
		const { value } = await client.get(key)
		return value ? (JSON.parse(value.toString()) as Value) : null
	} catch (error) {
		logError('Attempted to fetch from cache', error, key)
		return null
	}
}

export default fromCache
