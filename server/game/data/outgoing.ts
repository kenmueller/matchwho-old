import type { PlayerData } from '../player.js'
import type GameState from '../state.js'

type OutgoingGameData = { key: 'game'; value: GameValue }

export interface GameValue {
	state: GameState
	round: number
	self: PlayerData | null
	players: PlayerData[]
}

export default OutgoingGameData
