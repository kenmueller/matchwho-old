import type GameState from './state.js'

export default interface GameMeta {
	state: GameState

	/** The creator of the game. */
	leader: string | null
}
