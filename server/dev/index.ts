import fromEnvironment from '../environment/from.js'
import log from '../log/value.js'

const DEV = log('DEV', fromEnvironment('NODE_ENV') === 'development')

export default DEV
