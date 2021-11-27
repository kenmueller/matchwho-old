import client from './client.js'

const cache = async <Value>(key: string, value: Value, expires?: number) => {
	await client.set(key, JSON.stringify(value), { expires })
}

export default cache
