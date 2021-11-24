import type Log from './index.js'
import getPrefix from './prefix.js'
import toString from './string.js'
import getTrace from './trace.js'

const log: Log = (label, value, id) => {
	const trace = getTrace()

	console.log(
		`${getPrefix(label, id)}${toString(value)}${trace ? `\n${trace}` : ''}`
	)

	return value
}

export default log
