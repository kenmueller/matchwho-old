import type Game from '../index.js'

type ServerGameData =
	/** The current game data. */
	| { key: 'game'; value: Game }

	/** The next game code. Transition immediately. */
	| { key: 'next'; value: string }

export default ServerGameData
