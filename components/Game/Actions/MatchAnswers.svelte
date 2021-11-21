<script lang="ts">
	import type Game from '../../../shared/game/index.js'
	import type Player from '../../../shared/game/player/index.js'
	import type ClientGameData from '../../../shared/game/data/client.js'
	import handleError from '../../../lib/error/handle.js'

	export let game: Game
	export let socket: WebSocket

	let playerLink: Player | null = null
	let answerLink: number | null = null

	$: players = game.players.filter(({ id }) => id !== game.turn?.player.id)
	$: answers = game.turn?.answers ?? []

	$: if (playerLink && answerLink) {
		try {
			const data: ClientGameData = {
				key: 'match',
				value: { player: playerLink.id, answer: answerLink }
			}

			socket.send(JSON.stringify(data))
			playerLink = answerLink = null
		} catch (error) {
			handleError(error)
		}
	}
</script>

<main>
	<section data-list="players">
		{#each players as player (player.id)}
			<p
				on:mousedown={() => (playerLink = player)}
				on:mouseup={() => (playerLink = player)}
			>
				{player.name}
			</p>
		{/each}
	</section>
	<section data-list="answers">
		{#each answers as answer, index (index)}
			<p
				on:mousedown={() => (answerLink = index)}
				on:mouseup={() => (answerLink = index)}
			>
				{answer}
			</p>
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
		gap: 15rem;
	}

	section {
		display: flex;
		position: relative;
		flex-direction: column;

		&::before {
			content: attr(data-list);
			position: absolute;
			bottom: 100%;
			left: 0;
			margin-bottom: 1rem;
			white-space: nowrap;
			text-transform: capitalize;
			font-size: 1.5rem;
			font-weight: 700;
			color: colors.$text;
		}
	}

	[data-list='players'] {
		align-items: flex-end;
	}

	[data-list='answers'] {
		align-items: flex-start;
	}

	p {
		max-width: max-content;
		padding: 0.5rem 1rem;
		cursor: pointer;
		font-weight: 700;
		color: colors.$text;
		background: colors.$overlay;
		border-radius: 0.5rem;

		& + & {
			margin-top: 2rem;
		}
	}
</style>
