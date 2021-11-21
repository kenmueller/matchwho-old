import type WebSocket from 'ws'

import type PlayerData from '../../shared/game/player/index.js'
import type Self from '../../shared/game/player/self.js'

export default interface Player {
	readonly socket: WebSocket
	readonly spectating: boolean
	readonly id: string
	readonly name: string
	leader: boolean
	points: number

	/** Answer to the current question. */
	answer: string | null
}

export const dataFromPlayer = (player: Player): PlayerData => ({
	id: player.id,
	name: player.name,
	leader: player.leader,
	points: player.points,
	answered: player.answer !== null
})

export const dataFromSelf = (player: Player): Self => ({
	id: player.id,
	name: player.name,
	leader: player.leader,
	points: player.points,
	answer: player.answer
})
