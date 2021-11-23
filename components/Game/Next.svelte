<script lang="ts">
	import type Game from '../../shared/game/index.js'
	import type ClientGameData from '../../shared/game/data/client.js'
	import handleError from '../../lib/error/handle.js'

	export let socket: WebSocket
	export let game: Game

	let starting = false

	const start = () => {
		try {
			if (starting) return
			starting = true

			const data: ClientGameData = { key: 'next' }
			socket.send(JSON.stringify(data))
		} catch (error) {
			starting = false
			handleError(error)
		}
	}

	$: leader = game.leader
	$: isLeader = leader && leader.id === game.self?.id
</script>

{#if isLeader}
	<button aria-busy={starting} on:click={start}>Start next game</button>
{:else}
	<p>Waiting {leader ? `for ${leader.name} ` : ''}to start the next game</p>
{/if}

<style lang="scss">
	@use 'shared/colors';

	button {
		padding: 0.4rem 0.8rem;
		font-size: 1.1rem;
		font-weight: 700;
		color: colors.$yellow;
		background: transparentize(colors.$yellow, 0.6);
		border: 0.125rem solid transparent;
		border-radius: 1rem;
		transition: background 0.15s, border-color 0.15s, opacity 0.15s;

		&:hover {
			background: transparent;
			border-color: colors.$yellow;
		}

		&[aria-busy='true'] {
			pointer-events: none;
		}
	}

	p {
		font-size: 1.1rem;
		font-weight: 700;
		color: colors.$text;
	}
</style>
