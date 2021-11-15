import type GameMeta from '../shared/game/meta.js'

export default interface Session {
	readonly gameMeta: GameMeta | null
}
