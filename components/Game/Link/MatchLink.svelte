<script lang="ts">
	import type Point from '../../../lib/point.js'
	import fromRem from '../../../lib/rem/from.js'
	import RawLink from './RawLink.svelte'

	const SPACING = fromRem(0.5)

	export let from: HTMLElement
	export let to: HTMLElement

	export let onClick: ((event: MouseEvent) => void) | undefined = undefined

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

	$: angle = Math.atan2(toPoint.y - fromPoint.y, toPoint.x - fromPoint.x)

	$: distance = Math.sqrt(
		Math.pow(toPoint.x - fromPoint.x, 2) + Math.pow(toPoint.y - fromPoint.y, 2)
	)

	const update = () => {
		updateId ^= 1
	}
</script>

<svelte:window on:resize={update} />

<RawLink from={fromPoint} {angle} {distance} {onClick} />
