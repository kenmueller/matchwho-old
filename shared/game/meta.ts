import type GameState from './state.js'

export default interface GameMeta {
	state: GameState

	/** The leader of the game. */
	leader: string | null

	/** The next game id. */
	next: string | null
}
