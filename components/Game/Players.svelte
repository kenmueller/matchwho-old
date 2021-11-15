<script lang="ts">
	import type Game from '../../lib/game'
	import Leader from '../../icons/Leader.svelte'

	export let game: Game
</script>

<aside>
	{#each game.players as player (player.id)}
		<div data-self={game.self?.id === player.id}>
			<p>{player.name}</p>
			{#if player.leader}
				<Leader />
			{/if}
		</div>
	{/each}
</aside>

<style lang="scss">
	@use 'shared/colors';

	aside {
		grid-area: players;
	}

	div {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: colors.$text;

		& + & {
			$spacing: 0.8rem;

			margin-top: $spacing;
			padding-top: $spacing;
			border-top: 0.125rem solid colors.$border;
		}
	}

	p {
		font-weight: 700;

		div[data-self='true'] &::after {
			content: ' (you)';
			opacity: 0.5;
		}
	}

	div > :global(svg) {
		height: 1.1rem;
		margin-left: 0.5rem;
	}
</style>
