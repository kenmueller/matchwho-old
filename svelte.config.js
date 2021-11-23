import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-node'

/** @type {import('vite').Plugin} */
const app = {
	name: 'app',
	configureServer: async server => {
		global.server = server.httpServer
		server.middlewares.use(
			(await import('./server-build/server/app.js')).default
		)
	}
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),
	compilerOptions: {
		immutable: true
	},
	kit: {
		adapter: adapter(),
		files: {
			assets: 'public',
			hooks: 'lib/hooks',
			lib: 'lib',
			routes: 'routes',
			serviceWorker: 'lib/service-worker',
			template: 'lib/index.html'
		},
		vite: {
			plugins: [app],
			server: {
				fs: {
					allow: ['.']
				}
			},
			resolve: {
				alias: [
					{
						find: /^(.*)\.js$/,
						replacement: '$1'
					}
				]
			}
		}
	}
}

export default config
