export default interface Player {
	readonly id: string
	readonly name: string
	readonly leader: boolean
	readonly points: number

	/** If the player has answered the current question. */
	readonly answered: boolean
}
