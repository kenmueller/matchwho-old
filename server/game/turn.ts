import type GameTurn from '../../shared/game/turn/index.js'
import type GameTurnState from '../../shared/game/turn/state.js'

type SharedKeys = 'question' | 'answers' | 'matches' | 'correctMatches'

export default interface InternalGameTurn extends Pick<GameTurn, SharedKeys> {
	state: GameTurnState
}
