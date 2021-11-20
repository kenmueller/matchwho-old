type ClientGameData =
	/** Start the game. */
	| { key: 'start' }

	/** Set the current question. */
	| { key: 'question'; value: string }

	/** Set this player's answer to the current question. */
	| { key: 'answer'; value: string }

export default ClientGameData
