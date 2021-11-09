<script lang="ts">
	import icon from '../shared/icon.svg'
</script>

<svelte:head>
	<link rel="icon" href={icon} />
</svelte:head>

<slot />

<style lang="scss" global>
	@use 'shared/colors' as *;

	*,
	::before,
	::after {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
			Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		border: none;
		outline: none;
	}

	html,
	body {
		height: 100%;
	}

	body {
		overscroll-behavior: none;
		background: var(--background);
	}
</style>
