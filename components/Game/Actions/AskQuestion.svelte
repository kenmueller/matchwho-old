<script lang="ts">
	import type ClientGameData from '../../../shared/game/data/client.js'
	import MAX_QUESTION_LENGTH from '../../../shared/game/question.js'
	import handleError from '../../../lib/error/handle.js'

	export let socket: WebSocket

	let input: HTMLTextAreaElement | null = null
	$: input?.focus()

	let question = ''
	let asking = false

	const ask = () => {
		try {
			if (asking) return
			asking = true

			const data: ClientGameData = { key: 'question', value: question }
			socket.send(JSON.stringify(data))
		} catch (error) {
			asking = false
			handleError(error)
		}
	}
</script>

<form on:submit|preventDefault={ask}>
	<textarea
		placeholder="Question"
		maxlength={MAX_QUESTION_LENGTH}
		bind:this={input}
		bind:value={question}
	/>
	<button aria-busy={asking} disabled={!question}>Ask Question</button>
</form>

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

	textarea {
		$min-lines: 6;
		$vertical-padding: 0.4rem;
		$line-height: 2ch;

		resize: vertical;
		width: 100%;
		min-height: calc(#{$line-height * $min-lines} + #{$vertical-padding * 2});
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
</style>
