<script lang="ts">
	import type Game from '../../../shared/game/index.js'
	import type ClientGameData from '../../../shared/game/data/client.js'
	import GameState from '../../../shared/game/state.js'
	import { MIN_PLAYERS } from '../../../shared/game/player/bounds.js'
	import handleError from '../../../lib/error/handle.js'
	import Message from './Message.svelte'

	export let socket: WebSocket
	export let game: Game

	$: leader = game.leader
	$: isLeader = leader && leader.id === game.self?.id

	$: loading = started && game.state === GameState.Joining
	$: disabled = game.players.length < MIN_PLAYERS

	let started = false

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

<main data-min-players={disabled ? MIN_PLAYERS : undefined}>
	{#if isLeader}
		<button aria-busy={loading} {disabled} on:click={start}> Start </button>
	{:else}
		<Message>
			Waiting {leader ? `for ${leader.name} ` : ''}to start the game
		</Message>
	{/if}
</main>

<style lang="scss">
	@use 'shared/colors';

	main {
		grid-area: main;
		justify-self: center;
		align-self: center;
		position: relative;
	}

	button {
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
		}
	}

	[data-min-players]::after {
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
</style>
