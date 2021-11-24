import log from '../log/value.js'
import logError from '../log/error.js'

const fromEnvironment = (key: string, fallback?: string) => {
	const value = process.env[key] ?? fallback

	if (typeof value !== 'string') {
		logError('Missing environment variable', key)
		process.exit(1)
	}

	return log(key, value)
}

export default fromEnvironment
