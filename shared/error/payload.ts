export default class ErrorWithPayload<Payload> extends Error {
	constructor(message: string, public payload: Payload) {
		super(message)
	}
}
