<script lang="ts">
	import type Game from '../../../shared/game/index.js'
	import Podium from '../Podium/Podium.svelte'

	export let socket: WebSocket
	export let game: Game

	$: players = [...game.players].sort((a, b) => b.points - a.points)
</script>

<main>
	<Podium {players} />
</main>

<style lang="scss">
	main {
		grid-area: main;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
