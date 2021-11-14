<script lang="ts">
	import type Game from '../../lib/game'
	import Players from './Players.svelte'

	export let socket: WebSocket
	export let game: Game
</script>

<div class="root">
	<Players {game} />
	{#if game.state === 'joining'}
		Joining
	{:else if game.state === 'started'}
		Started
	{:else}
		Completed
	{/if}
</div>

<style lang="scss">
	.root {
		display: grid;
		grid: 1fr / 15rem 1fr;
		gap: 4rem;
		height: 100%;
		padding: 8rem 12rem;
	}
</style>
