import ORIGIN from './index.js'

const SOCKET_ORIGIN = new URL(
	`${ORIGIN.protocol.replace(/^http/, 'ws')}//${ORIGIN.host}`
)

export default SOCKET_ORIGIN
