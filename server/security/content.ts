import { getCSP, SELF, INLINE } from 'csp-header'

import DEV from '../dev/index.js'
import SOCKET_ORIGIN from '../origin/socket.js'

const CONTENT_SECURITY_POLICY = getCSP({
	directives: {
		'default-src': [SELF],
		'connect-src': [SELF, SOCKET_ORIGIN],
		'style-src': [SELF, INLINE],
		'base-uri': [SELF],
		'upgrade-insecure-requests': !DEV
	}
})

export default CONTENT_SECURITY_POLICY
