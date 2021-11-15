<script lang="ts">
	import type Game from '../../shared/game/index.js'
	import { MAX_PLAYERS } from '../../shared/game/player/bounds.js'
	import Players from './Players.svelte'
	import Joining from './Joining.svelte'
	import Started from './Started.svelte'

	export let socket: WebSocket
	export let game: Game

	$: status = (() => {
		switch (game.state) {
			case 'joining':
				return `Waiting for Players (${game.players.length}/${MAX_PLAYERS})`
			case 'started':
				return 'Started'
			case 'completed':
				return 'Completed'
		}
	})()
</script>

<svelte:head>
	<title>{status} | Match Who</title>
</svelte:head>

<div class="root" data-spectating={!game.self}>
	<h1>{status}</h1>
	<Players {game} />
	{#if game.state === 'joining'}
		<Joining {socket} {game} />
	{:else if game.state === 'started'}
		<Started />
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
		position: relative;
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

		&[data-spectating='true']::after {
			content: 'spectating';
			position: absolute;
			top: 1rem;
			right: 2rem;
			font-size: 1.2rem;
			font-weight: 800;
			color: colors.$text;
			opacity: 0.5;
		}
	}

	h1 {
		grid-area: status;
		font-size: 3rem;
		font-weight: 800;
		color: colors.$text;
	}
</style>
