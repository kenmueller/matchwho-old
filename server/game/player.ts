import type WebSocket from 'ws'

import type PlayerData from '../../shared/game/player/index.js'
import type Self from '../../shared/game/player/self.js'

export default interface Player {
	socket: WebSocket
	spectating: boolean
	id: string
	name: string
	points: number

	/** Answer to the current question. */
	answer: string | null
}

export const dataFromPlayer = (player: Player): PlayerData => ({
	id: player.id,
	name: player.name,
	points: player.points,
	answered: player.answer !== null
})

export const dataFromSelf = (player: Player): Self => ({
	id: player.id,
	name: player.name,
	points: player.points,
	answer: player.answer
})
