<script lang="ts">
	import MEASUREMENT_ID from '../lib/measurement.js'
	import MetaRoot from '../components/Meta/Root.svelte'
	import Analytics from '../components/Analytics.svelte'
</script>

<MetaRoot />
<Analytics id={MEASUREMENT_ID} />

<slot />

<style lang="scss" global>
	@use 'shared/colors';

	*,
	::before,
	::after {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		font-family: inherit;
		font-size: inherit;
		font-weight: inherit;
		border: none;
		outline: none;
	}

	html,
	body {
		height: 100%;
	}

	body {
		overscroll-behavior: none;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
			Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		background: colors.$background;
	}

	button {
		cursor: pointer;

		&:disabled {
			cursor: default;
		}
	}
</style>
