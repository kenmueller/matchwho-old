import fromEnvironment from '../environment/from.js'
import DEV from '../dev/index.js'
import PORT from '../port.js'
import log from '../log/value.js'

const DEV_ORIGIN = log('DEV_ORIGIN', `http://localhost:${PORT}`)
const PRODUCTION_ORIGIN = log(
	'PRODUCTION_ORIGIN',
	fromEnvironment('VITE_ORIGIN')
)

const ORIGIN = log('ORIGIN', DEV ? DEV_ORIGIN : PRODUCTION_ORIGIN)

export default ORIGIN
