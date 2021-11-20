import type GameTurnState from './state.js'
import type Player from '../player/index.js'

export default interface GameTurn {
	readonly player: Player
	readonly state: GameTurnState

	/**
	 * The current question.
	 * `null` if the current player hasn't thought of a question yet.
	 */
	readonly question: string | null
}
