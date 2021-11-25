<script lang="ts">
	import { onMount } from 'svelte'

	import { dev } from '$app/env'

	interface WithDataLayer {
		dataLayer?: unknown[][]
	}

	const BASE_URL = `http${dev ? '' : 's'}://www.googletagmanager.com`

	export let id: string

	$: url = `${BASE_URL}/gtag/js?id=${id}`

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
	<link rel="preconnect" href={BASE_URL} />
	<link rel="preload" href={url} as="script" />
	<script async src={url}></script>
</svelte:head>
