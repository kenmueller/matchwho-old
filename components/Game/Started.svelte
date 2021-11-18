<script lang="ts">
	import type Game from '../../shared/game/index.js'
	import AskQuestion from './Actions/AskQuestion.svelte'

	export let socket: WebSocket
	export let game: Game

	$: myTurn = game.turn?.player.id === game.self?.id
</script>

{#if game.turn}
	{#if game.turn.state === 'waiting'}
		{#if myTurn}
			<AskQuestion {socket} />
		{:else}
			<h3>{game.turn.player.name} is thinking of a question</h3>
		{/if}
	{:else if game.turn.state === 'answering'}
		{#if myTurn}
			<h3>Players are answering</h3>
		{:else}
			Answer the question: {game.turn.question ?? '(error)'}
		{/if}
	{:else if game.turn.state === 'matching'}
		{#if myTurn}
			Match the answers
		{:else}
			<h3>{game.turn.player.name} is matching your answers</h3>
		{/if}
	{/if}
{:else}
	<h3 class="error">An unknown error occurred</h3>
{/if}

<style lang="scss">
	@use 'shared/colors';

	h3 {
		grid-area: main;
		justify-self: center;
		align-self: center;
		text-align: center;
		font-size: 1.5rem;
		font-weight: 700;
		color: colors.$text;
	}

	.error {
		color: colors.$red;
	}
</style>
