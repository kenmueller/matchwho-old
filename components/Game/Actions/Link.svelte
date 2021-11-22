<script lang="ts">
	import fromRem from '../../../lib/rem/from.js'

	interface Point {
		x: number
		y: number
	}

	const SPACING = fromRem(0.5)

	export let from: HTMLElement
	export let to: HTMLElement

	let updateId = 0

	$: fromPoint = ((): Point => {
		updateId

		const { left, width, top, height } = from.getBoundingClientRect()
		return { x: left + width + SPACING, y: top + height / 2 }
	})()

	$: toPoint = ((): Point => {
		updateId

		const { left, top, height } = to.getBoundingClientRect()
		return { x: left - SPACING, y: top + height / 2 }
	})()

	$: angle = Math.atan((toPoint.y - fromPoint.y) / (toPoint.x - fromPoint.x))

	$: distance = Math.sqrt(
		Math.pow(toPoint.x - fromPoint.x, 2) + Math.pow(toPoint.y - fromPoint.y, 2)
	)

	const update = () => {
		updateId ^= 1
	}
</script>

<svelte:window on:resize={update} />

<span
	style="
		--x: {fromPoint.x}px;
		--y: {fromPoint.y}px;
		--angle: {angle}rad;
		--distance: {distance}px;
	"
/>

<style lang="scss">
	@use 'sass:math';
	@use 'shared/colors';

	$thickness: 0.2rem;

	span {
		position: fixed;
		left: var(--x);
		top: var(--y);
		width: var(--distance);
		height: $thickness;
		background: colors.$text;
		border-radius: math.div($thickness, 2);
		transform: rotate(var(--angle));
		transform-origin: left;
	}
</style>
