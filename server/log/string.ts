const toString = <Value>(value: Value) => {
	switch (typeof value) {
		case 'undefined':
			return 'undefined'
		case 'string':
			return value
		default:
			return JSON.stringify(value)
	}
}

export default toString
