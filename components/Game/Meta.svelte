<script lang="ts">
	import type GameMeta from '../../shared/game/meta.js'
	import GameState from '../../shared/game/state.js'

	export let meta: GameMeta

	$: status = (() => {
		switch (meta.state) {
			case GameState.Joining:
				return `Join ${meta.leader ?? 'Game'}`
			case GameState.Started:
				return `Spectate ${meta.leader ?? 'Game'}`
			case GameState.Completed:
				return 'Game over'
		}
	})()
</script>

<svelte:head>
	<meta name="description" content="Match Who" />
	<title>{status} | Match Who</title>
</svelte:head>
