import format from 'pg-format'

import type QueryValue from './value.js'
import log from '../../log/value.js'

export type InsertOptions = { table: string; columns: string[] } & (
	| { values: QueryValue[] }
	| { rows: QueryValue[][] }
)

const insert = (options: InsertOptions) =>
	log(
		'Insert operation',
		format(
			`INSERT INTO %I (%I) VALUES ${'values' in options ? '(%L)' : '%L'}`,
			options.table,
			options.columns,
			'values' in options ? options.values : options.rows
		)
	)

export default insert
