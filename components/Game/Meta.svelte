<script lang="ts">
	import type GameMeta from '../../shared/game/meta.js'
	import GameState from '../../shared/game/state.js'
	import MetaTitle from '../Meta/Title.svelte'
	import MetaDescription from '../Meta/Description.svelte'

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

<MetaTitle value={`${status} | Match Who`} />
<MetaDescription />
