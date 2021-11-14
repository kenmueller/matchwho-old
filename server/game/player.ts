import type WebSocket from 'ws'

export default interface Player {
	readonly socket: WebSocket
	readonly id: string
	readonly name: string
	readonly leader: boolean
}

export type PlayerData = Omit<Player, 'socket'>

export const dataFromPlayer = (player: Player): PlayerData => ({
	id: player.id,
	name: player.name,
	leader: player.leader
})
