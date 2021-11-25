import logError from '../log/error.js'

const fromEnvironment = (key: string, fallback?: string) => {
	const value = process.env[key] ?? fallback

	if (typeof value !== 'string')
		throw logError(
			'Attempted to load environment variable',
			new Error(`Missing environment variable ${key}`)
		)

	return value
}

export default fromEnvironment
