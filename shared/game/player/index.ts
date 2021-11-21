export default interface Player {
	id: string
	name: string
	leader: boolean
	points: number

	/** If the player has answered the current question. */
	answered: boolean
}
