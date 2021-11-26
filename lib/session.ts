import type GameMeta from '../shared/game/meta.js'
import type SavedGame from '../shared/game/saved/index.js'

export default interface Session {
	gameMeta: GameMeta | SavedGame | null
}
