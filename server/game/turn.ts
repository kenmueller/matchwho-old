import type GameTurnState from '../../shared/game/turn/state.js'

export default interface InternalGameTurn {
	state: GameTurnState

	/**
	 * The current question.
	 * `null` if the current player hasn't thought of a question yet.
	 */
	readonly question: string | null
}
