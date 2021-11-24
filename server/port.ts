import fromEnvironment from './environment/from.js'
import DEV from './dev/index.js'
import log from './log/value.js'

const DEFAULT_PORT = log('DEFAULT_PORT', fromEnvironment('VITE_DEFAULT_PORT'))
const PORT = log('CURRENT_PORT', DEV ? DEFAULT_PORT : fromEnvironment('PORT'))

export default PORT
