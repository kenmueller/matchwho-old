import HttpError, { HttpErrorCode } from '../../../shared/error/http.js'
import type Game from '../index.js'
import type Player from '../player.js'
import GameTurnState from '../../../shared/game/turn/state.js'
import type MatchData from '../../../shared/game/data/match.js'
import log from '../../log/value.js'
import logError from '../../log/error.js'

const onMatch = (game: Game, sender: Player, value: MatchData) => {
	if (!(typeof value === 'object' && value))
		throw logError(
			'Receiving match request',
			new HttpError(HttpErrorCode.Socket, 'Invalid match')
		)

	const { current } = game

	if (!current)
		throw logError(
			'Receiving match request',
			new HttpError(HttpErrorCode.Socket, 'The questioner does not exist')
		)

	const { player: id, answer } = value

	if (typeof id !== 'string' || id === current.id)
		throw logError(
			'Receiving match request',
			new HttpError(HttpErrorCode.Socket, 'Invalid player')
		)

	const player = game.players.find(player => player.id === id)

	if (!player)
		throw logError(
			'Receiving match request',
			new HttpError(HttpErrorCode.Socket, 'Unknown player')
		)

	const { answers, matches } = game.turn

	if (!answers)
		throw logError(
			'Receiving match request',
			new HttpError(HttpErrorCode.Socket, 'Unable to load answers')
		)

	if (!matches)
		throw logError(
			'Receiving match request',
			new HttpError(HttpErrorCode.Socket, 'Unable to load matches')
		)

	if (typeof answer !== 'number' || answer < 0 || answer >= answers.length)
		throw logError(
			'Receiving match request',
			new HttpError(HttpErrorCode.Socket, 'Invalid answer')
		)

	if (sender.id !== current.id)
		throw logError(
			'Receiving match request',
			new HttpError(HttpErrorCode.Socket, 'You must be the one matching')
		)

	if (game.turn.state !== GameTurnState.Matching)
		throw logError(
			'Receiving match request',
			new HttpError(
				HttpErrorCode.Socket,
				'Matching is not allowed at this time'
			)
		)

	for (const [otherPlayer, otherAnswer] of Object.entries(matches))
		if (otherAnswer === answer) {
			delete matches[otherPlayer]
			log('Found existing match', { player: otherPlayer, answer: otherAnswer })

			break
		}

	matches[player.id] = answer
	log('Received match', { player: player.id, answer })
}

export default onMatch
