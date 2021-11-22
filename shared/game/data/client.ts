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

	/** Remove a match for a player id. */
	| { key: 'unmatch'; value: string }

	/** Done matching. */
	| { key: 'matched' }

	/** Done with the current turn. */
	| { key: 'next' }

export default ClientGameData
