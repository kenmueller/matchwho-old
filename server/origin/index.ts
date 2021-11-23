import fromEnvironment from '../environment/from.js'
import DEV from '../dev/index.js'
import PORT from '../port.js'

const PRODUCTION_ORIGIN = fromEnvironment('VITE_ORIGIN')
const ORIGIN = DEV ? `http://localhost:${PORT}` : PRODUCTION_ORIGIN

export default ORIGIN
