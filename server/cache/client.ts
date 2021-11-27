import { Client } from 'memjs'

import fromEnvironment from '../environment/from.js'

const SERVERS = fromEnvironment('MEMCACHIER_SERVERS')
const client = Client.create(SERVERS, { expires: 60 * 60 })

export default client
