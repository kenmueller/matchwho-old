<script lang="ts">
	import type ClientGameData from '../../../shared/game/data/client.js'

	export let socket: WebSocket

	let input: HTMLTextAreaElement | null = null
	$: input?.focus()

	let question = ''
	let asking = false

	const ask = () => {
		asking = true

		const data: ClientGameData = { key: 'question', value: question }
		socket.send(JSON.stringify(data))
	}
</script>

<form on:submit|preventDefault={ask}>
	<textarea placeholder="Question" bind:this={input} bind:value={question} />
	<button aria-busy={asking} disabled={!question}>Ask Question</button>
</form>

<style lang="scss">
	form {
		grid-area: main;
		justify-self: center;
		align-self: center;
	}

	textarea {
	}
</style>
