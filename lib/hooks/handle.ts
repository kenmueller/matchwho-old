import type { Handle } from '@sveltejs/kit'

import getContentSecurityPolicy from '../security/content.js'
import insertNonce from '../security/insert.js'

const handle: Handle<Record<string, never>, unknown> = async ({
	request,
	resolve
}) => {
	const response = await resolve(request)
	const security = getContentSecurityPolicy()

	return {
		...response,
		headers: {
			'content-security-policy': security.value,
			'cache-control': 'no-store',
			'expect-ct': '0',
			'referrer-policy': 'no-referrer',
			'strict-transport-security': 'max-age=15552000',
			'x-content-type-options': 'nosniff',
			'x-dns-prefetch-control': 'off',
			'x-download-options': 'noopen',
			'x-frame-options': 'SAMEORIGIN',
			'x-permitted-cross-domain-policies': 'none',
			'x-xss-protection': '0',
			...response.headers
		},
		body:
			typeof response.body === 'string'
				? insertNonce(response.body, security.nonce)
				: response.body
	}
}

export default handle
