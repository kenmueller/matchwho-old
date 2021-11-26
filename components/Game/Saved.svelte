<script lang="ts">
	import type SavedGame from '../../shared/game/saved/index.js'
	import WithNavbar from '../Navigation/WithNavbar.svelte'
	import Completed from './States/Completed.svelte'

	export let game: SavedGame
</script>

<WithNavbar>
	<div>
		<h1>Game Results</h1>
		<Completed players={game.players} questions={game.questions} />
	</div>
	<svelte:fragment slot="items">
		{#if game.next !== null}
			<a rel="external" href="/{game.next}">View next game</a>
		{/if}
	</svelte:fragment>
</WithNavbar>

<style lang="scss">
	@use 'shared/colors';

	div {
		display: grid;
		grid:
			'title' auto
			'main' 1fr /
			1fr;
		height: 100%;
		gap: 2rem;
		padding: 2rem 1rem;

		@media (min-width: 31.25rem) {
			padding: 2rem;
		}

		@media (min-width: 50rem) {
			padding: 2rem 4rem;
		}

		@media (min-width: 68.75rem) {
			gap: 3rem;
			padding: 3rem 6rem;
		}

		@media (min-width: 75rem) {
			padding: 4rem 12rem;
		}
	}

	h1 {
		grid-area: title;
		font-size: 1.4rem;
		font-weight: 800;
		color: colors.$text;

		@media (min-width: 25rem) {
			font-size: 2rem;
		}

		@media (min-width: 50rem) {
			font-size: 3rem;
		}
	}

	a {
		padding: 0.4rem 0.8rem;
		text-decoration: none;
		font-size: 1.1rem;
		font-weight: 700;
		color: colors.$yellow;
		background: transparentize(colors.$yellow, 0.6);
		border: 0.125rem solid transparent;
		border-radius: 1rem;
		transition: background 0.15s, border-color 0.15s;

		&:hover {
			background: transparent;
			border-color: colors.$yellow;
		}
	}
</style>
