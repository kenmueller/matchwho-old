export default interface CorrectGameTurn {
	/** The number of matches the player guessed correctly. */
	count: number

	/** A map of `Player` ids and answer indices. */
	matches: Record<string, number>
}
