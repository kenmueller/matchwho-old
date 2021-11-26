import type GameMeta from '../../shared/game/meta.js'

const parseGameMeta = (value: string) => {
	try {
		return JSON.parse(value) as GameMeta | null
	} catch {
		return null
	}
}

export default parseGameMeta
