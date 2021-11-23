import type { Server } from 'http'

let devServer: Server | null = null

export const setDevServer = (server: Server) => {
	if (devServer) throw new Error('Dev server has already been set')
	devServer = server
}

export default devServer
