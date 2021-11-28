/// <reference lib="webworker" />

import { timestamp, files } from '$service-worker'

type MaybePromise<Value> = Value | Promise<Value>

const CACHE = `cache${timestamp}`
const OFFLINE_CACHE = `offline${timestamp}`

const worker = self as unknown as ServiceWorkerGlobalScope

worker.addEventListener('install', event => {
	event.waitUntil(
		caches
			.open(CACHE)
			.then(cache => cache.addAll(files))
			.then(() => worker.skipWaiting())
	)
})

worker.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(async keys => {
			await Promise.all(keys.map(key => key === CACHE || caches.delete(key)))
			await worker.clients.claim()
		})
	)
})

worker.addEventListener('fetch', event => {
	if (event.request.method !== 'GET') return

	const url = new URL(event.request.url)
	if (url.origin !== worker.location.origin) return

	const asset = files.includes(url.pathname)
	if (event.request.cache === 'only-if-cached' && !asset) return

	event.respondWith((asset ? stale : revalidate)(event.request))
})

const save = async (request: Request, cache: MaybePromise<Cache>) => {
	const response = await fetch(request)
	if (!response.ok) throw new Error(await response.text())

	void saveTransaction(request, response.clone(), cache)

	return response
}

const saveTransaction = async (
	request: Request,
	response: Response,
	cache: MaybePromise<Cache>
) => {
	await (await cache).put(request, response)
}

const fromCache = async (request: Request) => {
	const response = await caches.match(request)

	if (!response) return null
	if (!response.ok) throw new Error(await response.clone().text())

	return response
}

const stale = async (request: Request) =>
	(await fromCache(request)) ?? save(request, caches.open(CACHE))

const revalidate = async (request: Request) => {
	try {
		return await save(request, caches.open(OFFLINE_CACHE))
	} catch (error) {
		const response = await fromCache(request)
		if (!response) throw error

		return response
	}
}
