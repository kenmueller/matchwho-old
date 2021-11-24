import { Pool } from 'pg'

import fromEnvironment from '../environment/from.js'

const pool = new Pool({
	connectionString: fromEnvironment('DATABASE_URL'),
	ssl: { rejectUnauthorized: false }
})

export default pool
