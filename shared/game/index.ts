import type GameState from './state.js'
import type GameTurn from './turn/index.js'
import type Player from './player/index.js'
import type Self from './player/self.js'

export default interface Game {
	state: GameState
	round: number

	/** `null` if the game hasn't started yet. */
	turn: GameTurn | null

	/**
	 * The player this data is being sent to.
	 * `null` if the player is spectating the game.
	 */
	self: Self | null

	players: Player[]
}
