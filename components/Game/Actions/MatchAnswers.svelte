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
	$: answers = game.turn?.answers ?? []

	$: matches = Object.entries(game.turn?.matches ?? {})

	$: dragging = (playerLink === null) !== (answerLink === null)

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

	$: myTurn = game.turn?.player.id === game.self?.id

	// prettier-ignore
	const ifTurn = <Value,>(value: Value) => (myTurn ? value : undefined)
</script>

<svelte:window on:mouseup={ifTurn(resetLink)} />

<main
	aria-disabled={!myTurn || dragging}
	data-question={game.turn?.question ?? '(error)'}
>
	<section class="players">
		<h3>Players</h3>
		{#each players as player (player.id)}
			<p
				bind:this={elements[player.id]}
				on:mousedown={ifTurn(setPlayerLink(player))}
				on:mouseup={ifTurn(setPlayerLink(player))}
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
				on:mousedown={ifTurn(setAnswerLink(index))}
				on:mouseup={ifTurn(setAnswerLink(index))}
			>
				{answer}
			</p>
		{/each}
	</section>
	{#each matches as [player, answer] (player)}
		{#if player in elements && answer in elements}
			<MatchLink
				from={elements[player]}
				to={elements[answer]}
				onClick={ifTurn(() => unmatch(player))}
			/>
		{/if}
	{/each}
	{#if point && dragging}
		<MouseLink from={point} />
	{/if}
</main>

<style lang="scss">
	@use 'shared/colors';

	main {
		grid-area: main;
		justify-self: center;
		align-self: center;
		display: grid;
		position: relative;
		grid: 1fr / auto auto;
		gap: 15rem;

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

	section {
		display: flex;
		flex-direction: column;
	}

	.players {
		align-items: flex-end;
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

		[aria-disabled='true'] & {
			cursor: unset;
		}

		& + & {
			margin-top: 2rem;
		}
	}
</style>
