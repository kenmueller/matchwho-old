<script lang="ts">
	import type Game from '../../../shared/game/index.js'

	export let game: Game
	export let socket: WebSocket

	$: players = game.players.filter(({ id }) => id !== game.turn?.player.id)
</script>

<main>
	<section class="names">
		{#each players as player (player.id)}
			<p>{player.name}</p>
		{/each}
	</section>
	<section class="answers">
		{#each players as player (player.id)}
			<p>{player.answer}</p>
		{/each}
	</section>
</main>

<style lang="scss">
	@use 'shared/colors';

	main {
		grid-area: main;
		justify-self: center;
		align-self: center;
		display: grid;
		grid: 1fr / auto auto;
		gap: 20rem;
	}

	.names,
	.answers {
		display: flex;
		flex-direction: column;
	}

	.names {
		align-items: flex-end;
	}

	.answers {
		align-items: flex-start;
	}

	p {
		max-width: max-content;
		padding: 0.5rem 1rem;
		font-weight: 700;
		color: colors.$text;
		background: colors.$overlay;
		border-radius: 0.5rem;

		& + & {
			margin-top: 2rem;
		}
	}
</style>
