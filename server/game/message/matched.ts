import HttpError, { HttpErrorCode } from '../../../shared/error/http.js'
import type Game from '../index.js'
import type Player from '../player.js'
import GameTurnState from '../../../shared/game/turn/state.js'
import log from '../../log/value.js'
import logError from '../../log/error.js'

const onMatched = (game: Game, player: Player) => {
	const { current } = game

	if (!current)
		throw logError(
			'Receiving finished matching request',
			new HttpError(HttpErrorCode.Socket, 'The questioner does not exist')
		)

	if (player.id !== current.id)
		throw logError(
			'Receiving finished matching request',
			new HttpError(HttpErrorCode.Socket, 'You must be the one matching')
		)

	if (game.turn.state !== GameTurnState.Matching)
		throw logError(
			'Receiving finished matching request',
			new HttpError(
				HttpErrorCode.Socket,
				'Matching is not allowed at this time'
			)
		)

	const { answers, matches } = game.turn

	if (!answers)
		throw logError(
			'Receiving finished matching request',
			new HttpError(HttpErrorCode.Socket, 'Unable to load answers')
		)

	if (!matches)
		throw logError(
			'Receiving finished matching request',
			new HttpError(HttpErrorCode.Socket, 'Unable to load matches')
		)

	if (!game.matched)
		throw logError(
			'Receiving finished matching request',
			new HttpError(HttpErrorCode.Socket, 'Not all answers have been matched.')
		)

	const { notCurrent } = game

	if (!notCurrent)
		throw logError(
			'Receiving finished matching request',
			new HttpError(HttpErrorCode.Socket, 'The questioner does not exist')
		)

	/** The index after the last index of the answer. */
	const nextAnswer: Record<string, number> = {}

	game.turn.correct = {
		count: notCurrent.reduce(
			(count, { id, answer }) =>
				count + (answers[matches[id]] === answer ? 1 : 0),
			0
		),
		matches: notCurrent.reduce<Record<string, number>>(
			(matches, { id, answer }) => {
				if (!answer) return matches

				const index = answers.indexOf(answer, nextAnswer[answer])
				if (index < 0) return matches

				matches[id] = index
				nextAnswer[answer] = index + 1

				return matches
			},
			{}
		)
	}

	player.points += Object.entries(matches).reduce((points, [id, index]) => {
		const player = game.players.find(player => player.id === id)
		return points + (player?.answer === answers[index] ? 1 : 0)
	}, 0)

	log('Finished matching', {
		points: player.points,
		correct: game.turn.correct
	})
}

export default onMatched
