const TRACE_START = 2
const TRACE_LENGTH = 3

const getTrace = ({ stack } = new Error()) => {
	if (!stack) return null

	return stack
		.split('\n')
		.slice(1 + TRACE_START, 1 + TRACE_START + TRACE_LENGTH)
		.map(line => line.replace(/^\s*at\s+/, '  '))
		.join('\n')
}

export default getTrace
