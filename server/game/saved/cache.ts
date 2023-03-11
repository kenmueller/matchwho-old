import type SavedGame from '../../../shared/game/saved/index.js'
// import cache from '../../cache/set.js'
// import log from '../../log/value.js'
// import logError from '../../log/error.js'

const cacheGame = (game: SavedGame) => {}
// cache(game.code, game)
// 	.then(() => {
// 		log('Cached game', game.code)
// 	})
// 	.catch(error => {
// 		logError('Attempted to cache game', error, game.code)
// 	})

export default cacheGame
