import type Player from '../player/index.js'

type SavedPlayer = Pick<Player, 'id' | 'name' | 'points'>

export default SavedPlayer
