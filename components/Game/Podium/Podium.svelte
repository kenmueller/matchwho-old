<script lang="ts">
	import type Player from '../../../shared/game/player/index.js'
	import Pedestal from './Pedestal.svelte'

	const INDICES = [1, 0, 2]

	export let players: Player[]
</script>

<section>
	{#each INDICES as index (index)}
		<Pedestal {players} {index} />
	{/each}
</section>

<style lang="scss">
	@use 'shared/colors';

	section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		max-width: 50rem;
		width: 100%;
		padding: 4rem 0;

		> :global(:nth-child(2)) {
			color: colors.$yellow;
			transform: translateY(3rem);
		}
	}
</style>
