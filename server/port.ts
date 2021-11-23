import fromEnvironment from './environment/from.js'
import DEV from './dev/index.js'

const DEFAULT_PORT = fromEnvironment('VITE_DEFAULT_PORT')
const PORT = DEV ? DEFAULT_PORT : fromEnvironment('PORT')

export default PORT
