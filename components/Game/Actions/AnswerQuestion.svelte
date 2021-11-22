<script lang="ts">
	import type Game from '../../../shared/game/index.js'
	import type ClientGameData from '../../../shared/game/data/client.js'
	import MAX_ANSWER_LENGTH from '../../../shared/game/answer.js'
	import handleError from '../../../lib/error/handle.js'
	import Message from '../States/Message.svelte'

	export let game: Game
	export let socket: WebSocket

	let input: HTMLTextAreaElement | null = null
	$: input?.focus()

	let answer = ''
	let answering = false

	const submit = () => {
		try {
			if (answering) return
			answering = true

			const data: ClientGameData = { key: 'answer', value: answer }
			socket.send(JSON.stringify(data))
		} catch (error) {
			answering = false
			handleError(error)
		}
	}
</script>

{#if game.self?.answer}
	<Message>
		Waiting for other players to answer
		<section slot="content">
			<h2>{game.turn?.question ?? '(error)'}</h2>
			<p>{game.self.answer}</p>
		</section>
	</Message>
{:else}
	<form on:submit|preventDefault={submit}>
		<h3 data-player={game.turn?.player.name}>
			{game.turn?.question ?? '(error)'}
		</h3>
		<textarea
			placeholder="Answer"
			maxlength={MAX_ANSWER_LENGTH}
			bind:this={input}
			bind:value={answer}
		/>
		<button aria-busy={answering} disabled={!answer}>Answer Question</button>
	</form>
{/if}

<style lang="scss">
	@use 'shared/colors';

	form {
		grid-area: main;
		justify-self: center;
		align-self: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		max-width: 30rem;
	}

	h3 {
		align-self: flex-start;
		position: relative;
		color: colors.$text;
		font-size: 1.5rem;
		font-weight: 700;

		&::before {
			content: attr(data-player) ' asked';
			position: absolute;
			bottom: 100%;
			left: 0;
			margin-bottom: 0.2rem;
			white-space: nowrap;
			font-size: 1rem;
			opacity: 0.5;
		}
	}

	textarea {
		$min-lines: 6;
		$vertical-padding: 0.4rem;
		$line-height: 2ch;

		resize: vertical;
		width: 100%;
		min-height: calc(#{$line-height * $min-lines} + #{$vertical-padding * 2});
		margin-top: 1rem;
		padding: 0.4rem 0.6rem;
		line-height: $line-height;
		font-weight: 600;
		color: colors.$yellow;
		background: transparent;
		border: 0.125rem solid colors.$yellow;
		border-radius: 0.8rem;
		transition: background 0.15s;

		&:hover,
		&:focus {
			background: transparentize(colors.$yellow, 0.9);
		}
	}

	button {
		margin-top: 0.8rem;
		padding: 0.4rem 0.8rem;
		font-size: 1.1rem;
		font-weight: 700;
		color: colors.$yellow;
		background: transparentize(colors.$yellow, 0.6);
		border: 0.125rem solid transparent;
		border-radius: 1rem;
		transition: background 0.15s, border-color 0.15s, opacity 0.15s;

		&[aria-busy='false']:not(:disabled):hover {
			background: transparent;
			border-color: colors.$yellow;
		}

		&[aria-busy='true'] {
			cursor: default;
		}

		&:disabled {
			opacity: 0.5;
		}
	}

	section {
		margin-top: 0.7rem;
		padding-top: 0.5rem;
		text-align: left;
		border-top: 0.125rem solid colors.$border;
	}

	h2 {
		font-size: 1.8rem;
	}

	p {
		margin-top: 0.2rem;
		font-size: 1.2rem;
		opacity: 0.5;
	}
</style>
