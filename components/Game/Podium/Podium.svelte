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

	$horizontal-min-width: 35.625rem;

	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 50rem;
		width: 100%;
		margin: 0 auto;

		@media (min-width: $horizontal-min-width) {
			flex-direction: row;
			justify-content: space-between;
			padding: 4rem 0;
		}

		> :global(* + *) {
			margin-top: 2rem;

			@media (min-width: $horizontal-min-width) {
				margin-top: 0;
			}
		}

		> :global(:nth-child(2)) {
			color: colors.$yellow;

			@media (min-width: $horizontal-min-width) {
				transform: translateY(3rem);
			}
		}
	}
</style>
