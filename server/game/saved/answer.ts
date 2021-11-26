import type SavedAnswer from '../../../shared/game/saved/answer.js'

export default interface RawSavedAnswer extends SavedAnswer {
	question_index: number
}
