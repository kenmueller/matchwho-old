import type { Response } from 'express'

import HttpError from '../../shared/error/http.js'

const sendError = (res: Response, error: unknown) => {
	try {
		res
			.status(error instanceof HttpError ? error.code : 500)
			.send(
				error instanceof Error ? error.message : 'An unknown error occurred'
			)
	} catch (error) {
		console.error(error)
	}
}

export default sendError
