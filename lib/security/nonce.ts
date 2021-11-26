import { randomBytes } from 'crypto'

const getNonce = () => randomBytes(16).toString('base64')

export default getNonce
