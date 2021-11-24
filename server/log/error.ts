import type Log from './index.js'
import getPrefix from './prefix.js'
import toString from './string.js'
import getTrace from './trace.js'

const logError: Log = (label, value, id) => {
	const logTrace = getTrace()
	const errorTrace = value instanceof Error ? getTrace(value) : null

	console.error(
		`${getPrefix(label, id)}${
			value instanceof Error ? value.message : toString(value)
		}${logTrace && errorTrace ? '\nLog trace:\n' : ''}${logTrace ?? ''}${
			logTrace && errorTrace ? '\nError trace:\n' : ''
		}${errorTrace ?? ''}`
	)

	return value
}

export default logError
