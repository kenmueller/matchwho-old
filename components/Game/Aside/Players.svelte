<script lang="ts">
	import type Game from '../../../shared/game/index.js'
	import GameState from '../../../shared/game/state.js'
	import Leader from '../../../icons/Leader.svelte'
	import Point from '../../../icons/Point.svelte'

	export let game: Game
</script>

<aside>
	{#each game.players as player (player.id)}
		<div
			class:self={game.self?.id === player.id}
			class:turn={game.state === GameState.Started &&
				game.turn?.player.id === player.id}
			class:done={player.answered}
		>
			<p class="name">
				{player.name}
				{#if player.leader}
					<Leader />
				{/if}
			</p>
			<p class="points">
				<Point />
				{player.points}
			</p>
		</div>
	{/each}
</aside>

<style lang="scss">
	@use 'shared/colors';

	aside {
		grid-area: players;
		display: none;

		@media (min-width: 50rem) {
			display: block;
		}
	}

	div {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-weight: 700;
		color: colors.$text;
		transition: color 0.15s;

		& + & {
			$spacing: 0.8rem;

			margin-top: $spacing;
			padding-top: $spacing;
			border-top: 0.125rem solid colors.$border;
		}
	}

	.turn {
		color: colors.$yellow;
	}

	.done {
		color: colors.$blue;
	}

	.name,
	.points {
		display: flex;
		align-items: center;
	}

	.name {
		.self &::after {
			content: '(you)';
			margin-left: 0.3em;
			white-space: nowrap;
			opacity: 0.5;
		}

		> :global(svg) {
			height: 1em;
			margin-left: 0.3em;
		}
	}

	.points > :global(svg) {
		height: 1em;
		margin-right: 0.3em;
	}
</style>
