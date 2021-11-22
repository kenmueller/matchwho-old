<script lang="ts">
	import type Game from '../../../shared/game/index.js'
	import type ClientGameData from '../../../shared/game/data/client.js'
	import GameState from '../../../shared/game/state.js'
	import { MIN_PLAYERS } from '../../../shared/game/player/bounds.js'
	import handleError from '../../../lib/error/handle.js'
	import Message from './Message.svelte'

	export let socket: WebSocket
	export let game: Game

	let started = false
	$: loading = started && game.state === GameState.Joining

	const start = () => {
		try {
			if (loading) return
			started = true

			const data: ClientGameData = { key: 'start' }
			socket.send(JSON.stringify(data))
		} catch (error) {
			started = false
			handleError(error)
		}
	}
</script>

{#if game.self?.leader}
	<button
		aria-busy={loading}
		data-min-players={MIN_PLAYERS}
		disabled={game.players.length < MIN_PLAYERS}
		on:click={start}
	>
		Start
	</button>
{:else}
	<Message>The leader must start the game</Message>
{/if}

<style lang="scss">
	@use 'shared/colors';

	button {
		grid-area: main;
		justify-self: center;
		align-self: center;
		position: relative;
		padding: 0.8rem 8rem;
		font-size: 1.5rem;
		font-weight: 700;
		color: colors.$yellow;
		background: transparentize(colors.$yellow, 0.6);
		border: 0.125rem solid transparent;
		border-radius: 1rem;
		transition: color 0.15s, background 0.15s, border-color 0.15s, opacity 0.15s;

		&:hover {
			background: transparent;
			border-color: colors.$yellow;
		}

		&[aria-busy='true'],
		&:disabled {
			pointer-events: none;
		}

		&:disabled {
			color: transparentize(colors.$yellow, 0.5);
			background: transparentize(colors.$yellow, 0.8);

			&::after {
				content: 'There must be at least ' attr(data-min-players) ' players';
				position: absolute;
				top: 100%;
				left: 0;
				margin-top: 0.7rem;
				white-space: nowrap;
				text-align: left;
				font-size: 1rem;
				font-weight: 700;
				color: colors.$red;
			}
		}
	}
</style>
