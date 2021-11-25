<script lang="ts">
	import { onMount } from 'svelte'

	interface WithDataLayer {
		dataLayer?: unknown[][]
	}

	export let id: string

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
	<script async src="https://www.googletagmanager.com/gtag/js?id={id}"></script>
</svelte:head>
