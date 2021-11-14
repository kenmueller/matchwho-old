import type { Response } from 'express'

import HttpsError from './https.js'

const sendError = (res: Response, error: unknown) => {
	try {
		res
			.status(error instanceof HttpsError ? error.code : 500)
			.send(
				error instanceof Error ? error.message : 'An unknown error occurred'
			)
	} catch (error) {
		console.error(error)
	}
}

export default sendError
