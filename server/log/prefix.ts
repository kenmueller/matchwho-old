import toString from './string.js'

const getPrefix = (label: string, id?: unknown) =>
	`${label}${id === undefined ? '' : ` (${toString(id)})`}: `

export default getPrefix
