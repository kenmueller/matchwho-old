import format from 'pg-format'

import log from '../../log/value.js'

export type InsertValue = string | number

export type InsertOptions = { table: string; columns: string[] } & (
	| { values: InsertValue[] }
	| { rows: InsertValue[][] }
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
