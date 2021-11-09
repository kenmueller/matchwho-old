export default class HttpsError extends Error {
	constructor(public code: number, message: string) {
		super(message)
	}
}
