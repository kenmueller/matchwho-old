<script lang="ts" context="module">
	export const load: Load = ({ page }) => ({
		props: { code: page.params.code }
	})
</script>

<script lang="ts">
	import type { Load } from '@sveltejs/kit'

	import { onMount } from 'svelte'

	import { goto } from '$app/navigation'

	import SOCKET_ORIGIN from '../lib/origin/socket'
	import handleError from '../lib/error/handle'

	export let code: string

	// onMount(() => {
	// 	const socket = new WebSocket(`${SOCKET_ORIGIN}/games/${code}`)

	// 	socket.addEventListener('open', () => {
	// 		socket.send('abc')
	// 	})

	// 	socket.addEventListener('message', ({ data }) => {
	// 		console.log(data)
	// 	})

	// 	socket.addEventListener('error', () => {
	// 		handleError()
	// 	})

	// 	socket.addEventListener('close', async ({ code, reason }) => {
	// 		try {
	// 			if (code !== 1000) handleError(new Error(reason))

	// 			await goto('/')
	// 		} catch (error) {
	// 			handleError(error)
	// 		}
	// 	})

	// 	return () => socket.close()
	// })
</script>

<h1>{code}</h1>

<style lang="scss">
	@use 'shared/colors';

	h1 {
		color: colors.$text;
	}
</style>
