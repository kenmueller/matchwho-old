<script lang="ts">
	import type Point from '../../../lib/point.js'

	export let from: Point
	export let angle: number
	export let distance: number
</script>

<span
	style="
		--x: {from.x}px;
		--y: {from.y}px;
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
