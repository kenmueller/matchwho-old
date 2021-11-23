import type GameState from './state.js'

export default interface GameMeta {
	state: GameState

	/** The leader of the game. */
	leader: string | null

	/** The next game code. */
	next: string | null
}
