import { dev } from '$app/env'

import fromEnvironment from '../environment/from.js'
import PORT from '../port.js'

const DEV_ORIGIN = new URL(`http://localhost:${PORT}`)
const PRODUCTION_ORIGIN = new URL(fromEnvironment('VITE_ORIGIN'))

const ORIGIN = dev ? DEV_ORIGIN : PRODUCTION_ORIGIN

export default ORIGIN
