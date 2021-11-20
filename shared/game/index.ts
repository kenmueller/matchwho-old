import type GameState from './state.js'
import type GameTurn from './turn/index.js'
import type Player from './player/index.js'

export default interface Game {
	readonly state: GameState
	readonly round: number

	/** `null` if the game hasn't started yet. */
	readonly turn: GameTurn | null

	/**
	 * The player this data is being sent to.
	 * `null` if the player is spectating the game.
	 */
	readonly self: Player | null

	readonly players: Player[]
}
