import format from 'pg-format'

import type QueryValue from './value.js'
import log from '../../log/value.js'

export interface UpdateOptions {
	table: string
	columns: Record<string, QueryValue>
	where: Parameters<typeof format>
}

const update = ({ table, columns, where }: UpdateOptions) =>
	log(
		'Update operation',
		format(
			'UPDATE %I SET %s WHERE %s',
			table,
			Object.entries(columns)
				.map(([name, value]) => format('%I = %L', name, value))
				.join(', '),
			format(...where)
		)
	)

export default update
