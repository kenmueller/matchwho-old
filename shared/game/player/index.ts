export default interface Player {
	id: string
	name: string
	points: number

	/** If the player has answered the current question. */
	answered: boolean
}
