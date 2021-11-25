import fromEnvironment from './environment/from.js'
import log from './log/value.js'

const ENV = log('ENV', fromEnvironment('NODE_ENV'))
const DEV = log('DEV', ENV === 'development')

export default DEV
