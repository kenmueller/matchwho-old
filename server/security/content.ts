import { getCSP, SELF, INLINE } from 'csp-header'

import DEV from '../dev.js'
import SOCKET_ORIGIN from '../origin/socket.js'
import log from '../log/value.js'

const CONTENT_SECURITY_POLICY = log(
	'CONTENT_SECURITY_POLICY',
	getCSP({
		directives: {
			'default-src': [SELF],
			'connect-src': [SELF, SOCKET_ORIGIN],
			'style-src': [SELF, INLINE],
			'script-src': [
				SELF,
				INLINE,
				`${DEV ? '' : 'https://'}www.googletagmanager.com/gtag/js`
			],
			'base-uri': [SELF],
			'upgrade-insecure-requests': !DEV
		}
	})
)

export default CONTENT_SECURITY_POLICY
