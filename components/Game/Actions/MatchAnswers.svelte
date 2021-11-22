<script lang="ts">
	import type Game from '../../../shared/game/index.js'
	import type Player from '../../../shared/game/player/index.js'
	import type ClientGameData from '../../../shared/game/data/client.js'
	import type Point from '../../../lib/point.js'
	import handleError from '../../../lib/error/handle.js'
	import MatchLink from '../Link/MatchLink.svelte'
	import MouseLink from '../Link/MouseLink.svelte'

	export let game: Game
	export let socket: WebSocket

	let elements: Record<string | number, HTMLElement> = {}
	let point: Point | null = null

	let playerLink: string | null = null
	let answerLink: number | null = null

	$: players = game.players.filter(({ id }) => id !== game.turn?.player.id)
	$: dragging = (playerLink === null) !== (answerLink === null)

	$: answers = game.turn?.answers ?? []
	$: matches = Object.entries(game.turn?.matches ?? {})

	$: correctMatches = game.turn?.correctMatches
		? Object.entries(game.turn.correctMatches)
		: null

	$: myTurn = game.turn?.player.id === game.self?.id
	$: disabled = !(myTurn && correctMatches === null)

	$: if (!(playerLink === null || answerLink === null)) {
		try {
			const data: ClientGameData = {
				key: 'match',
				value: { player: playerLink, answer: answerLink }
			}

			socket.send(JSON.stringify(data))
			resetLink()
		} catch (error) {
			handleError(error)
		}
	}

	const setPoint = (event: MouseEvent) => {
		event.stopPropagation()
		point = { x: event.clientX, y: event.clientY }
	}

	const setPlayerLink = (player: Player) => (event: MouseEvent) => {
		setPoint(event)
		playerLink === null ? (playerLink = player.id) : resetLink()
	}

	const setAnswerLink = (index: number) => (event: MouseEvent) => {
		setPoint(event)
		answerLink === null ? (answerLink = index) : resetLink()
	}

	const resetLink = () => {
		playerLink = answerLink = null
	}

	const unmatch = (player: string) => {
		try {
			const data: ClientGameData = { key: 'unmatch', value: player }
			socket.send(JSON.stringify(data))
		} catch (error) {
			handleError(error)
		}
	}

	let loadingMatched = false
	$: isMatched = answers.length === matches.length

	const matched = () => {
		try {
			if (loadingMatched) return
			loadingMatched = true

			const data: ClientGameData = { key: 'matched' }
			socket.send(JSON.stringify(data))
		} catch (error) {
			loadingMatched = false
			handleError(error)
		}
	}

	let loadingNext = false

	const next = () => {
		try {
			if (loadingNext) return
			loadingNext = true

			const data: ClientGameData = { key: 'next' }
			socket.send(JSON.stringify(data))
		} catch (error) {
			loadingNext = false
			handleError(error)
		}
	}
</script>

<svelte:window on:mouseup={disabled ? undefined : resetLink} />

<main
	class:dragging
	aria-disabled={disabled}
	data-question={game.turn?.question ?? '(error)'}
>
	<section class="players">
		<h3>Players</h3>
		{#each players as player (player.id)}
			<p
				bind:this={elements[player.id]}
				on:mousedown={setPlayerLink(player)}
				on:mouseup={setPlayerLink(player)}
			>
				{player.name}
			</p>
		{/each}
	</section>
	<section class="answers">
		<h3>Answers</h3>
		{#each answers as answer, index (index)}
			<p
				bind:this={elements[index]}
				on:mousedown={setAnswerLink(index)}
				on:mouseup={setAnswerLink(index)}
			>
				{answer}
			</p>
		{/each}
	</section>
	{#if myTurn}
		<button
			class:next={correctMatches}
			aria-busy={correctMatches ? loadingNext : loadingMatched}
			disabled={!(correctMatches || isMatched)}
			on:click={correctMatches ? next : matched}
		>
			{correctMatches ? 'Done' : 'Show Correct Matches'}
		</button>
	{:else if correctMatches}
		<h4>Showing Correct Matches</h4>
	{/if}
</main>

{#each correctMatches ?? matches as [player, answer] (player)}
	{#if player in elements && answer in elements}
		<MatchLink
			from={elements[player]}
			to={elements[answer]}
			onClick={disabled ? undefined : () => unmatch(player)}
		/>
	{/if}
{/each}

{#if !disabled && dragging && point}
	<MouseLink from={point} />
{/if}

<style lang="scss">
	@use 'sass:math';
	@use 'shared/colors';

	$vertical-spacing: 2rem;

	main {
		grid-area: main;
		justify-self: center;
		align-self: center;
		display: grid;
		position: relative;
		grid:
			'players answers' auto
			'info info' auto /
			auto auto;
		gap: 0 15rem;

		&::before {
			content: attr(data-question);
			position: absolute;
			bottom: 100%;
			left: 0;
			margin-bottom: 2rem;
			font-size: 1.5rem;
			font-weight: 700;
			color: colors.$text;
			opacity: 0.5;
		}
	}

	[aria-disabled='true'] section {
		pointer-events: none;
	}

	section {
		display: flex;
		flex-direction: column;
	}

	.players {
		grid-area: players;
		align-items: flex-end;
	}

	.answers {
		grid-area: answers;
		align-items: flex-start;
	}

	h3 {
		margin-bottom: 1rem;
		white-space: nowrap;
		font-size: 1.5rem;
		font-weight: 700;
		color: colors.$text;
	}

	p {
		max-width: max-content;
		padding: 0.5rem 1rem;
		cursor: pointer;
		user-select: none;
		font-weight: 700;
		color: colors.$text;
		background: colors.$overlay;
		border-radius: 0.5rem;
		transition: opacity 0.15s;

		.dragging & {
			cursor: unset;
		}

		& + & {
			margin-top: 2rem;
		}
	}

	button,
	h4 {
		grid-area: info;
		justify-self: center;
		margin-top: $vertical-spacing;
	}

	button {
		padding: 0.4rem 2rem;
		font-size: 1.1rem;
		font-weight: 700;
		color: colors.$yellow;
		background: transparentize(colors.$yellow, 0.6);
		border: 0.125rem solid transparent;
		border-radius: 1rem;
		transition: background 0.15s, border-color 0.15s, opacity 0.15s;

		&:hover {
			background: transparent;
			border-color: colors.$yellow;
		}

		&[aria-busy='true'],
		&:disabled {
			pointer-events: none;
		}

		&:disabled {
			opacity: 0.5;
		}
	}

	.next {
		$message-line-height: 2ch;
		$message-spacing: 1rem;

		position: relative;
		margin-top: calc(
			#{math.div($vertical-spacing, 2) + $message-spacing} + #{$message-line-height}
		);

		&::before {
			content: 'Showing Correct Answers';
			position: absolute;
			bottom: 100%;
			left: 50%;
			margin-bottom: $message-spacing;
			white-space: nowrap;
			line-height: $message-line-height;
			text-align: center;
			transform: translateX(-50%);
		}
	}

	h4 {
		margin-top: math.div($vertical-spacing, 2);
		text-align: center;
		font-size: 1.1rem;
		font-weight: 700;
		color: colors.$yellow;
	}
</style>
