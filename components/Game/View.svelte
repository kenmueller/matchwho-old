<script lang="ts">
	import type Game from '../../shared/game/index.js'
	import GameState from '../../shared/game/state.js'
	import closeMessage from '../../lib/close/message.js'
	import Status from './Aside/Status.svelte'
	import Players from './Aside/Players.svelte'
	import Joining from './States/Joining.svelte'
	import Started from './States/Started.svelte'

	export let socket: WebSocket
	export let game: Game
</script>

<div
	class="root"
	data-spectating={!game.self}
	use:closeMessage={game.state === GameState.Started
		? 'You will lose all your progress if you exit the game now.'
		: null}
>
	<Status {game} />
	<Players {game} />
	{#if game.state === GameState.Joining}
		<Joining {socket} {game} />
	{:else if game.state === GameState.Started}
		<Started {socket} {game} />
	{:else if game.state === GameState.Completed}
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
	}

	[data-spectating='true']::after {
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
