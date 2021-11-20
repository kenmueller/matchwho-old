<script lang="ts">
	import type Game from '../../shared/game/index.js'
	import GameTurnState from '../../shared/game/turn/state.js'
	import AskQuestion from './Actions/AskQuestion.svelte'

	export let socket: WebSocket
	export let game: Game

	$: myTurn = game.turn?.player.id === game.self?.id
</script>

{#if game.turn}
	{#if game.turn.state === GameTurnState.Waiting}
		{#if myTurn}
			<AskQuestion {socket} />
		{:else}
			<main>
				<h3>{game.turn.player.name} is thinking of a question</h3>
			</main>
		{/if}
	{:else if game.turn.state === GameTurnState.Answering}
		{#if myTurn}
			<main>
				<h3>Players are answering your question</h3>
				<p>{game.turn.question ?? '(error)'}</p>
			</main>
		{:else}
			{game.turn.question ?? '(error)'}
		{/if}
	{:else if game.turn.state === GameTurnState.Matching}
		{#if myTurn}
			Match the answers
		{:else}
			<main>
				<h3>{game.turn.player.name} is matching your answers</h3>
			</main>
		{/if}
	{/if}
{:else}
	<h3 class="error">An unknown error occurred</h3>
{/if}

<style lang="scss">
	@use 'shared/colors';

	main {
		grid-area: main;
		justify-self: center;
		align-self: center;
		text-align: center;
		color: colors.$text;
		font-weight: 700;
	}

	h3 {
		font-size: 1.5rem;
	}

	p {
		margin-top: 1rem;
		opacity: 0.5;
	}

	.error {
		color: colors.$red;
	}
</style>
