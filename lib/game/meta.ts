import type GameState from './state'

export default interface GameMeta {
	readonly state: GameState
	readonly leader: string | null
}
