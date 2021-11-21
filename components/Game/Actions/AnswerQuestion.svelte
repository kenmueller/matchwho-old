<script lang="ts">
	import type Game from '../../../shared/game/index.js'
	import type ClientGameData from '../../../shared/game/data/client.js'

	export let game: Game
	export let socket: WebSocket

	let input: HTMLTextAreaElement | null = null
	$: input?.focus()

	let answer = ''
	let answering = false

	const submit = () => {
		if (answering) return
		answering = true

		const data: ClientGameData = { key: 'answer', value: answer }
		socket.send(JSON.stringify(data))
	}
</script>

<form on:submit|preventDefault={submit}>
	<h3 data-player={game.turn?.player.name}>
		{game.turn?.question ?? '(error)'}
	</h3>
	<textarea placeholder="Answer" bind:this={input} bind:value={answer} />
	<button aria-busy={answering} disabled={!answer}>Answer Question</button>
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
</style>