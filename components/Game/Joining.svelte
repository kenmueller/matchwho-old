<script lang="ts">
	import type Game from '../../lib/game'
	import type OutgoingGameData from '../../lib/game/data/outgoing'
	import { MIN_PLAYERS } from '../../lib/game/players/bounds'

	export let socket: WebSocket
	export let game: Game

	let started = false

	const start = () => {
		started = true

		const data: OutgoingGameData = { key: 'start' }
		socket.send(JSON.stringify(data))
	}
</script>

{#if game.current.leader}
	<button
		style="--min-players: {MIN_PLAYERS};"
		aria-busy={started && game.state === 'joining'}
		disabled={game.players.length < MIN_PLAYERS}
		on:click={start}
	>
		Start
	</button>
{:else}
	<h3>The leader must start the game</h3>
{/if}

<style lang="scss">
	@use 'shared/colors';

	button,
	h3 {
		grid-area: main;
		justify-self: center;
		align-self: center;
	}

	button {
		position: relative;
		padding: 0.8rem 8rem;
		font-size: 1.5rem;
		font-weight: 700;
		color: colors.$yellow;
		background: transparentize(colors.$yellow, 0.6);
		border: 0.125rem solid transparent;
		border-radius: 1rem;
		transition: color 0.15s, background 0.15s, border-color 0.15s, opacity 0.15s;

		&[aria-busy='false']:not(:disabled):hover {
			background: transparent;
			border-color: colors.$yellow;
		}

		&[aria-busy='true'] {
			cursor: default;
		}

		&:disabled {
			color: transparentize(colors.$yellow, 0.5);
			background: transparentize(colors.$yellow, 0.8);

			&::after {
				counter-reset: min-players var(--min-players);
				content: 'There must be at least ' counter(min-players) ' players';
				position: absolute;
				top: 100%;
				left: 0;
				white-space: nowrap;
				margin-top: 0.7rem;
				text-align: left;
				font-size: 1rem;
				font-weight: 700;
				color: colors.$red;
			}
		}
	}

	h3 {
		font-size: 1.5rem;
		font-weight: 700;
		color: colors.$text;
	}
</style>
