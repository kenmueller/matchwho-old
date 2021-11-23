import fromEnvironment from './environment/from.js'

const DEFAULT_PORT = fromEnvironment('VITE_DEFAULT_PORT')
const PORT = fromEnvironment('PORT', DEFAULT_PORT)

export default PORT
