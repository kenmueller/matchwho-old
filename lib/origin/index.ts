import { dev } from '$app/env'

import fromEnvironment from '../environment/from.js'
import PORT from '../port.js'

const PRODUCTION_ORIGIN = fromEnvironment('VITE_ORIGIN')
const ORIGIN = dev ? `http://localhost:${PORT}` : PRODUCTION_ORIGIN

export default ORIGIN
