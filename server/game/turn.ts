import type GameTurn from '../../shared/game/turn/index.js'
import type GameTurnState from '../../shared/game/turn/state.js'

export default interface InternalGameTurn
	extends Pick<GameTurn, 'question' | 'answers' | 'matches'> {
	state: GameTurnState
}
