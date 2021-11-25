import ORIGIN from './index.js'
import log from '../log/value.js'

const SOCKET_ORIGIN = new URL(
	`${ORIGIN.protocol.replace(/^http/, 'ws')}//${ORIGIN.host}`
)
log('SOCKET_ORIGIN', SOCKET_ORIGIN.href)

export default SOCKET_ORIGIN
