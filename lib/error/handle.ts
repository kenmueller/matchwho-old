const DEFAULT_ERROR = 'An unknown error occurred'

const handleError = (error: unknown = new Error(DEFAULT_ERROR)) => {
	console.error(error)
	alert(error instanceof Error ? error.message : DEFAULT_ERROR)
}

export default handleError
