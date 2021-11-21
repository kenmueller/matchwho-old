import type Player from './index.js'

export default interface Self extends Omit<Player, 'answered'> {
	/** The player's answer to the current question. */
	readonly answer: string | null
}
