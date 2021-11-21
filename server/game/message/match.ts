import HttpError, { HttpErrorCode } from '../../../shared/error/http.js'
import type Game from '../index.js'
import type Player from '../player.js'
import GameTurnState from '../../../shared/game/turn/state.js'
import type MatchData from '../../../shared/game/data/match.js'

const onMatch = (game: Game, sender: Player, value: MatchData) => {
	if (!(typeof value === 'object' && value))
		throw new HttpError(HttpErrorCode.Socket, 'Invalid match')

	const { current } = game

	if (!current)
		throw new HttpError(HttpErrorCode.Socket, 'The questioner does not exist')

	const { player: id, answer } = value

	if (typeof id !== 'string' || id === current.id)
		throw new HttpError(HttpErrorCode.Socket, 'Invalid player')

	const player = game.players.find(player => player.id === id)
	if (!player) throw new HttpError(HttpErrorCode.Socket, 'Unknown player')

	const { answers, matches } = game.turn

	if (!answers)
		throw new HttpError(HttpErrorCode.Socket, 'Unable to load answers')

	if (!matches)
		throw new HttpError(HttpErrorCode.Socket, 'Unable to load matches')

	if (typeof answer !== 'number' || answer < 0 || answer >= answers.length)
		throw new HttpError(HttpErrorCode.Socket, 'Invalid answer')

	if (sender.id !== current.id)
		throw new HttpError(HttpErrorCode.Socket, 'You must be the one matching')

	if (game.turn.state !== GameTurnState.Matching)
		throw new HttpError(
			HttpErrorCode.Socket,
			'Matching is not allowed at this time'
		)

	matches[player.id] = answer

	for (const [otherPlayer, otherAnswer] of Object.entries(matches))
		if (otherAnswer === answer) {
			delete matches[otherPlayer]
			break
		}
}

export default onMatch
