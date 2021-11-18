import type GameTurnState from './state.js'
import type Player from '../player/index.js'

export default interface GameTurn {
	readonly player: Player
	readonly state: GameTurnState
	readonly question: string | null
}
