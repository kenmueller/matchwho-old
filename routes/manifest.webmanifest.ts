import type { RequestHandler } from '@sveltejs/kit'
import type { WebAppManifest } from 'web-app-manifest'

import png from '../shared/icon.png'
import svg from '../shared/icon.svg'

const manifest: WebAppManifest = {
	dir: 'ltr',
	lang: 'en-US',
	scope: '/',
	start_url: '/',
	name: 'Match Who',
	short_name: 'Match',
	description: 'The ultimate party game',
	display: 'standalone',
	theme_color: '#1c1c1e',
	background_color: '#1c1c1e',
	categories: ['games', 'social'],
	icons: [
		{ src: png, sizes: '512x512', purpose: 'monochrome maskable' },
		{ src: svg, sizes: '512x512' }
	]
}

let data: string | null = null

export const get: RequestHandler = () => ({
	headers: {
		'cache-control': 'no-cache',
		'content-type': 'application/manifest+json'
	},
	body: (data ??= JSON.stringify(manifest))
})
