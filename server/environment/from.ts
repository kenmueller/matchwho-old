import logError from '../log/error.js'

const fromEnvironment = (key: string, fallback?: string) => {
	const value = process.env[key] ?? fallback

	if (typeof value !== 'string') {
		logError(
			'Attempted to load environment variable',
			`Missing environment variable ${key}`
		)
		process.exit(1)
	}

	return value
}

export default fromEnvironment
