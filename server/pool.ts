import { createPool } from 'slonik'

import fromEnvironment from './environment/from.js'

const pool = createPool(fromEnvironment('DATABASE_URL'), {
	ssl: { rejectUnauthorized: false }
})

export default pool
