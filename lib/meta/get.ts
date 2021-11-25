import type { LoadInput, LoadOutput } from '@sveltejs/kit'

import { browser } from '$app/env'

import ErrorWithPayload from '../../shared/error/payload.js'
import type Session from '../session.js'
import type GameMeta from '../../shared/game/meta.js'
import ORIGIN from '../origin/index.js'

const getMeta = async (
	code: string,
	{ session, fetch }: Pick<LoadInput, 'session' | 'fetch'>
) => {
	if (browser) {
		const response = await fetch(new URL(`/games/${code}`, ORIGIN).href)

		if (!response.ok)
			throw new ErrorWithPayload<LoadOutput>('Error fetching meta', {
				status: 307,
				redirect: '/'
			})

		return (await response.json()) as GameMeta
	}

	const { gameMeta: meta } = session as Session

	if (!meta)
		throw new ErrorWithPayload<LoadOutput>('Session does not contain meta', {
			status: 307,
			redirect: '/'
		})

	return meta
}

export default getMeta
