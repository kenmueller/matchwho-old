import type WebSocket from 'ws'

export default interface Player {
	readonly socket: WebSocket
	readonly spectating: boolean
	readonly id: string
	readonly name: string
	leader: boolean
}

export interface PlayerData {
	readonly id: string
	readonly name: string
	readonly leader: boolean
}

export const dataFromPlayer = (player: Player): PlayerData => ({
	id: player.id,
	name: player.name,
	leader: player.leader
})
