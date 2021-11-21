export default class HttpError extends Error {
	constructor(public code: HttpErrorCode, message: string) {
		super(message)
	}
}

export const enum HttpErrorCode {
	BadRequest = 400,
	NotFound = 404,
	Socket = 1003
}
