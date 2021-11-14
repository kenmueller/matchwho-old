import type { PlayerData } from '../player.js'
import type GameState from '../state.js'

type OutgoingGameData = { key: 'players'; value: PlayersValue }

export interface PlayersValue {
	state: GameState
	current: PlayerData
	players: PlayerData[]
}

export default OutgoingGameData
