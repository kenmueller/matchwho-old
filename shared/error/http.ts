export default class HttpError extends Error {
	constructor(public code: HttpErrorCode, message: string) {
		super(message)
	}
}

export enum HttpErrorCode {
	PermanentRedirect = 301,
	TemporaryRedirect = 307,
	BadRequest = 400,
	NotFound = 404,
	Socket = 1003
}
