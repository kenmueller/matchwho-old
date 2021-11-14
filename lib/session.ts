import type GameMeta from './game/meta'

export default interface Session {
	gameMeta: GameMeta | null
}
