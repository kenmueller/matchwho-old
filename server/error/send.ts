import type { Response } from 'express'

import HttpError from '../../shared/error/http.js'
import logError from '../log/error.js'

const sendError = (res: Response, error: unknown) => {
	try {
		logError('Sending error', error)

		res
			.status(error instanceof HttpError ? error.code : 500)
			.send(
				error instanceof Error ? error.message : 'An unknown error occurred'
			)
	} catch (error) {
		logError('Attempted to send error', error)
	}
}

export default sendError
