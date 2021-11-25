<script lang="ts">
	import { onMount } from 'svelte'

	interface WithDataLayer {
		dataLayer?: unknown[][]
	}

	const BASE_URL = 'https://www.googletagmanager.com'

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
	<link rel="preload" href={url} />
	<script async src={url}></script>
</svelte:head>
