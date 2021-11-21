<script lang="ts">
	export let description: string | null = null
	export let error = false
</script>

<main class:error>
	<h3>
		<slot />
	</h3>
	{#if description}
		<p>{description}</p>
	{/if}
</main>

<style lang="scss">
	@use 'shared/colors';

	main {
		grid-area: main;
		justify-self: center;
		align-self: center;
		text-align: center;
		color: colors.$text;
		font-weight: 700;
	}

	h3 {
		font-size: 1.5rem;

		.error & {
			color: colors.$red;
		}
	}

	p {
		margin-top: 1rem;
		font-size: 1.2rem;
		opacity: 0.5;
	}
</style>
