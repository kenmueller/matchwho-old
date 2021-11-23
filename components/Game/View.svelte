<script lang="ts">
	import type Game from '../../shared/game/index.js'
	import GameState from '../../shared/game/state.js'
	import closeMessage from '../../lib/close/message.js'
	import Status from './Aside/Status.svelte'
	import Players from './Aside/Players.svelte'
	import Joining from './States/Joining.svelte'
	import Started from './States/Started.svelte'
	import Completed from './States/Completed.svelte'

	export let socket: WebSocket
	export let game: Game

	$: running = game.state !== GameState.Completed
</script>

<div
	class:running
	class:spectating={!game.self}
	use:closeMessage={game.state === GameState.Started
		? 'You will lose all your progress if you exit the game now.'
		: null}
>
	<Status {game} />
	{#if running}
		<Players {game} />
	{/if}
	{#if game.state === GameState.Joining}
		<Joining {socket} {game} />
	{:else if game.state === GameState.Started}
		<Started {socket} {game} />
	{:else if game.state === GameState.Completed}
		<Completed {socket} {game} />
	{/if}
</div>

<style lang="scss">
	@use 'shared/colors';

	div {
		display: grid;
		grid:
			'status' auto
			'main' 1fr /
			1fr;
		position: relative;
		height: 100%;
		gap: 2rem 3rem;
		padding: 2rem 1rem;

		@media (min-width: 31.25rem) {
			padding: 2rem;
		}

		@media (min-width: 50rem) {
			padding: 2rem 4rem;
		}

		@media (min-width: 68.75rem) {
			gap: 3rem 4rem;
			padding: 3rem 6rem;
		}

		@media (min-width: 75rem) {
			padding: 4rem 12rem;
		}
	}

	.running {
		@media (min-width: 50rem) {
			grid:
				'status status' auto
				'players main' 1fr /
				15rem 1fr;
		}
	}

	.spectating::after {
		content: 'spectating';
		position: absolute;
		top: 1rem;
		right: 2rem;
		white-space: nowrap;
		font-size: 1.2rem;
		font-weight: 800;
		color: colors.$text;
		opacity: 0.5;
	}
</style>
