<script lang="ts">
	import type Game from '../../lib/game'

	export let game: Game
</script>

<aside>
	{#each game.players as player (player.id)}
		<div data-current={game.current.id === player.id}>
			<p>{player.name}</p>
		</div>
	{/each}
</aside>

<style lang="scss">
	@use 'shared/colors';

	$spacing: 0.8rem;

	div {
		& + & {
			margin-top: $spacing;
			padding-top: $spacing;
			border-top: 0.125rem solid colors.$border;
		}
	}

	p {
		font-weight: 700;
		color: colors.$text;

		div[data-current='true'] &::after {
			content: ' (you)';
			opacity: 0.5;
		}
	}
</style>
