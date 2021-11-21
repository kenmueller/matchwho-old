import type MatchData from './match.js'

type ClientGameData =
	/** Start the game. */
	| { key: 'start' }

	/** Set the current question. */
	| { key: 'question'; value: string }

	/** Set this player's answer to the current question. */
	| { key: 'answer'; value: string }

	/** Create a match between a player id and an answer index. */
	| { key: 'match'; value: MatchData }

export default ClientGameData
