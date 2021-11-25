<script lang="ts">
	import { onMount } from 'svelte'

	import ORIGIN from '../lib/origin/index.js'

	interface WithDataLayer {
		dataLayer?: unknown[][]
	}

	const BASE_URL = new URL(`${ORIGIN.protocol}//www.googletagmanager.com`)

	export let id: string

	$: url = new URL(`/gtag/js?id=${encodeURIComponent(id)}`, BASE_URL)

	const gtag = ((...options) => {
		;(window as WithDataLayer).dataLayer?.push(options)
	}) as Gtag.Gtag

	onMount(() => {
		;(window as WithDataLayer).dataLayer ??= []

		gtag('js', new Date())
		gtag('config', id)
	})
</script>

<svelte:head>
	<link rel="preconnect" href={BASE_URL.href} />
	<link rel="preload" href={url.href} as="script" />
	<script async src={url.href}></script>
</svelte:head>
