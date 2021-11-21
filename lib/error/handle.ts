const DEFAULT_ERROR = new Error('An unknown error occurred')

const handleError = (error: unknown = DEFAULT_ERROR) => {
	console.error(error)
	alert(error instanceof Error ? error.message : DEFAULT_ERROR.message)
}

export default handleError
