<script lang="ts">
	import type Game from '../../../shared/game/index.js'
	import GameTurnState from '../../../shared/game/turn/state.js'
	import Message from './Message.svelte'
	import AskQuestion from '../Actions/AskQuestion.svelte'
	import AnswerQuestion from '../Actions/AnswerQuestion.svelte'

	export let socket: WebSocket
	export let game: Game

	$: myTurn = game.turn?.player.id === game.self?.id
</script>

{#if game.turn}
	{#if game.turn.state === GameTurnState.Waiting}
		{#if myTurn}
			<AskQuestion {socket} />
		{:else}
			<Message>
				{game.turn.player.name} is thinking of a question
			</Message>
		{/if}
	{:else if game.turn.state === GameTurnState.Answering}
		{#if myTurn}
			<Message description={game.turn.question ?? '(error)'}>
				Players are answering your question
			</Message>
		{:else}
			<AnswerQuestion {game} {socket} />
		{/if}
	{:else if game.turn.state === GameTurnState.Matching}
		{#if myTurn}
			<Message>Match the answers</Message>
		{:else}
			<Message>
				{game.turn.player.name} is matching your answers
			</Message>
		{/if}
	{/if}
{:else}
	<Message error>An unknown error occurred</Message>
{/if}
