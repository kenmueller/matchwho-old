import { getCSP, SELF, INLINE, nonce } from 'csp-header'

import { dev } from '$app/env'

import ORIGIN from '../origin/index.js'
import SOCKET_ORIGIN from '../origin/socket.js'
import getNonce from './nonce.js'

export interface ContentSecurityPolicy {
	nonce: string
	value: string
}

const ANALYTICS_SCRIPT = new URL(
	'/gtag/js',
	`${ORIGIN.protocol}//www.googletagmanager.com`
)

const ANALYTICS_IMAGE = new URL(
	'/a',
	`${ORIGIN.protocol}//www.googletagmanager.com`
)

const getContentSecurityPolicy = (): ContentSecurityPolicy => {
	const nonceId = getNonce()

	return {
		nonce: nonceId,
		value: getCSP({
			directives: {
				'default-src': [SELF],
				'connect-src': [SELF, SOCKET_ORIGIN.href],
				'style-src': [SELF, ...(dev ? [INLINE] : [])],
				'script-src': [SELF, nonce(nonceId), ANALYTICS_SCRIPT.href],
				'img-src': [SELF, ANALYTICS_IMAGE.href],
				'base-uri': [SELF],
				'upgrade-insecure-requests': !dev
			}
		})
	}
}

export default getContentSecurityPolicy
