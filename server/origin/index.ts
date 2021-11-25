import fromEnvironment from '../environment/from.js'
import DEV from '../dev.js'
import PORT from '../port.js'
import log from '../log/value.js'

const DEV_ORIGIN = new URL(`http://localhost:${PORT}`)
log('DEV_ORIGIN', DEV_ORIGIN.href)

const PRODUCTION_ORIGIN = new URL(fromEnvironment('VITE_ORIGIN'))
log('PRODUCTION_ORIGIN', PRODUCTION_ORIGIN.href)

const ORIGIN = DEV ? DEV_ORIGIN : PRODUCTION_ORIGIN
log('ORIGIN', ORIGIN.href)

export default ORIGIN
