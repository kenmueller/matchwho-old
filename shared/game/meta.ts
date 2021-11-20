import type GameState from './state.js'

export default interface GameMeta {
	readonly state: GameState

	/** The creator of the game. */
	readonly leader: string | null
}
