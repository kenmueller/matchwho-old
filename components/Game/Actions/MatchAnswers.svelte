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
</script>

<svelte:window on:mouseup={resetLink} />

<main data-dragging={dragging}>
	<section data-list="players">
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
	<section data-list="answers">
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
	{#each matches as [player, answer] (player)}
		{#if player in elements && answer in elements}
			<MatchLink from={elements[player]} to={elements[answer]} />
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
		grid: 1fr / auto auto;
		gap: 15rem;
	}

	section {
		display: flex;
		position: relative;
		flex-direction: column;

		&::before {
			content: attr(data-list);
			position: absolute;
			bottom: 100%;
			left: 0;
			margin-bottom: 1rem;
			white-space: nowrap;
			text-transform: capitalize;
			font-size: 1.5rem;
			font-weight: 700;
			color: colors.$text;
		}
	}

	[data-list='players'] {
		align-items: flex-end;
	}

	[data-list='answers'] {
		align-items: flex-start;
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

		[data-dragging='true'] & {
			cursor: unset;
		}

		& + & {
			margin-top: 2rem;
		}
	}
</style>
