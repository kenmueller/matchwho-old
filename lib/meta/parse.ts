import type GameMeta from '../../shared/game/meta.js'
import type SavedGame from '../../shared/game/saved/index.js'

const parseGameMeta = (value: string) => {
	try {
		return JSON.parse(value) as GameMeta | SavedGame | null
	} catch {
		return null
	}
}

export default parseGameMeta
