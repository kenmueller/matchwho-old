import DEV from './dev.js'
import PORT from './port.js'

const ORIGIN = DEV
	? `http://localhost:${PORT}`
	: 'https://matchwho.herokuapp.com'

export default ORIGIN
