import type Game from '../index.js'

type ServerGameData =
	/** The current game data. */
	{ key: 'game'; value: Game }

export default ServerGameData
