import type GameState from './state.js'

export default interface GameMeta {
	readonly state: GameState
	readonly leader: string | null
}
