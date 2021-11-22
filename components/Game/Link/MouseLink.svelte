<script lang="ts">
	import type Point from '../../../lib/point.js'
	import RawLink from './RawLink.svelte'

	export let from: Point
	let to: Point | null = null

	$: angle = to && Math.atan2(to.y - from.y, to.x - from.x)

	$: distance =
		to && Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2))

	const updateTo = ({ clientX, clientY }: MouseEvent) => {
		to = { x: clientX, y: clientY }
	}
</script>

<svelte:window on:mousemove={updateTo} />

{#if !(angle === null || distance === null)}
	<RawLink {from} {angle} {distance} />
{/if}
