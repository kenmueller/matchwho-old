export default interface Player {
	readonly id: string
	readonly name: string
	readonly leader: boolean
	readonly points: number

	/** The player's answer to the current question. */
	readonly answer: string | null
}
