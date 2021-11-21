import type GameTurnState from './state.js'
import type Player from '../player/index.js'

export default interface GameTurn {
	player: Player
	state: GameTurnState

	/**
	 * The current question.
	 * `null` if the current player hasn't thought of a question yet.
	 */
	question: string | null

	/**
	 * All the player's answers to the current question.
	 * Does not provide a reference back to who gave the answer.
	 * Shuffled.
	 */
	answers: string[] | null

	/**
	 * A map of `Player` ids and answer indices.
	 */
	matches: Record<string, number> | null
}
