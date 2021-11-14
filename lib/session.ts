import type GameMeta from './game/meta'

export default interface Session {
	readonly gameMeta: GameMeta | null
}
