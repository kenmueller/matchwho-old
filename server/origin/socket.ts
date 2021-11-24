import ORIGIN from './index.js'
import log from '../log/value.js'

const SOCKET_ORIGIN = log('SOCKET_ORIGIN', ORIGIN.replace(/^http/, 'ws'))

export default SOCKET_ORIGIN
