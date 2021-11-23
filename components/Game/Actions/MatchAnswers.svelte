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

	$: correct = game.turn?.correct
		? {
				count: game.turn.correct.count,
				matches: Object.entries(game.turn.correct.matches)
		  }
		: null

	$: myTurn = game.turn?.player.id === game.self?.id
	$: disabled = !(myTurn && correct === null)

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
	<div
		class="columns"
		data-correct={correct?.count}
		data-total={correct?.matches.length}
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
	</div>
	{#if myTurn}
		<button
			aria-busy={correct ? loadingNext : loadingMatched}
			disabled={!(correct || isMatched)}
			on:click={correct ? next : matched}
		>
			{correct ? 'Done' : 'Show Correct Matches'}
		</button>
	{/if}
</main>

{#each correct?.matches ?? matches as [player, answer] (player)}
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

	main {
		grid-area: main;
		justify-self: center;
		align-self: center;
		display: flex;
		position: relative;
		flex-direction: column;
		align-items: center;

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

	.columns {
		display: flex;
		position: relative;
	}

	[data-correct][data-total]::after {
		content: 'Showing Correct Answers (' attr(data-correct) '/' attr(data-total)
			')';
		position: absolute;
		top: 100%;
		left: 50%;
		margin-top: 1rem;
		white-space: nowrap;
		text-align: center;
		font-weight: 700;
		color: colors.$yellow;
		transform: translateX(-50%);
	}

	section {
		display: flex;
		flex-direction: column;
	}

	.players {
		align-items: flex-end;
		margin-right: 4rem;

		@media (min-width: 31.25rem) {
			margin-right: 7rem;
		}

		@media (min-width: 35.625rem) {
			margin-right: 10rem;
		}

		@media (min-width: 65.625rem) {
			margin-right: 15rem;
		}
	}

	.answers {
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

	button {
		margin-top: 2.5rem;
		padding: 0.4rem 1rem;
		font-size: 1rem;
		font-weight: 700;
		color: colors.$yellow;
		background: transparentize(colors.$yellow, 0.6);
		border: 0.125rem solid transparent;
		border-radius: 1rem;
		transition: background 0.15s, border-color 0.15s, opacity 0.15s;

		@media (min-width: 35.625rem) {
			padding: 0.4rem 2rem;
			font-size: 1.1rem;
		}

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
</style>
