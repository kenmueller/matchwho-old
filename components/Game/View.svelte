<script lang="ts">
	import type Game from '../../lib/game'
	import { MAX_PLAYERS } from '../../lib/game/players/bounds'
	import Joining from './Joining.svelte'
	import Players from './Players.svelte'

	export let socket: WebSocket
	export let game: Game

	$: status =
		game.state === 'joining'
			? `Waiting for Players (${game.players.length}/${MAX_PLAYERS})`
			: 'Status'
</script>

<svelte:head>
	<title>{status} | Match Who</title>
</svelte:head>

<div class="root">
	<h1>{status}</h1>
	<Players {game} />
	{#if game.state === 'joining'}
		<Joining {socket} {game} />
	{:else if game.state === 'started'}
		<h3 style="grid-area: main;">Started</h3>
	{:else}
		<h3 style="grid-area: main;">Completed</h3>
	{/if}
</div>

<style lang="scss">
	@use 'shared/colors';

	.root {
		display: grid;
		grid:
			'status status' auto
			'players main' 1fr /
			15rem 1fr;
		height: 100%;
		gap: 2rem 3rem;
		padding: 2rem 4rem;

		@media (min-width: 68.75rem) {
			gap: 3rem 4rem;
			padding: 3rem 6rem;
		}

		@media (min-width: 75rem) {
			padding: 4rem 12rem;
		}
	}

	h1 {
		grid-area: status;
		font-size: 3rem;
		font-weight: 800;
		color: colors.$text;
	}
</style>
