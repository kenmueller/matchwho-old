enum GameTurnState {
	/** The user has not thought of a question yet. */
	Waiting,

	/** The user has thought of a question and the other players are coming up with answers. */
	Answering,

	/** All other players have answered and the current player is matching their answers. */
	Matching
}

export default GameTurnState
