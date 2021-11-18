import type GameState from './state.js'
import type GameTurn from './turn/index.js'
import type Player from './player/index.js'

export default interface Game {
	readonly state: GameState
	readonly round: number
	readonly turn: GameTurn | null
	readonly self: Player | null
	readonly players: Player[]
}
