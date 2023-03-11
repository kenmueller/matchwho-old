const env = {
	VITE_MEASUREMENT_ID: 'abc',
	VITE_DEFAULT_PORT: '3001',
	PORT: '3001',
	VITE_ORIGIN: 'https://a.com',
	NODE_ENV: 'development'
}

const fromEnvironment = (key: string, fallback?: string) => {
	const value = env[key] ?? fallback

	if (typeof value !== 'string')
		throw new Error(`Missing environment variable ${key}`)

	return value
}

export default fromEnvironment
