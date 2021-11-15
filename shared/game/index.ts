import type Player from './player/index.js'
import type GameState from './state.js'

export default interface Game {
	state: GameState
	round: number
	self: Player | null
	players: Player[]
}
