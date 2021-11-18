import type GameTurnState from '../../shared/game/turn/state.js'

export default interface InternalGameTurn {
	state: GameTurnState
	readonly question: string | null
}
