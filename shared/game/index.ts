import type GameState from './state.js'
import type GameTurn from './turn/index.js'
import type GameResults from './results/index.js'
import type Player from './player/index.js'
import type Self from './player/self.js'

export default interface Game {
	code: string

	state: GameState
	round: number

	/** `null` if the game hasn't started yet. */
	turn: GameTurn | null

	/** `null` if the game isn't completed yet. */
	results: GameResults | null

	/**
	 * The player this data is being sent to.
	 * `null` if the player is spectating the game.
	 */
	self: Self | null

	/** The leader of the game. */
	leader: Player | null

	players: Player[]
}
