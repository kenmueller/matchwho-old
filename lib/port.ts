import fromEnvironment from './environment/from.js'

const PORT = fromEnvironment('VITE_DEFAULT_PORT')

export default PORT
