import fromEnvironment from '../environment/from.js'

const DEV = fromEnvironment('NODE_ENV') === 'development'

export default DEV
