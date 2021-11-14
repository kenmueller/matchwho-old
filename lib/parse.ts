const parse = (data: string) => {
	try {
		return JSON.parse(data)
	} catch {
		return null
	}
}

export default parse
