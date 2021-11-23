<script lang="ts">
	import Match from '../../icons/Match.svelte'
</script>

<nav>
	<a href="/">
		<Match />
		Match Who
	</a>
	<slot />
</nav>

<style lang="scss">
	@use 'shared/colors';

	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.8rem 1.2rem;
		background: colors.$overlay;
		border-bottom: 0.125rem solid colors.$border;
	}

	a {
		display: flex;
		align-items: center;
		margin-right: 1rem;
		text-decoration: none;
		font-size: 1.5rem;
		font-weight: 800;
		color: colors.$text;
		transition: color 0.15s;

		&:hover {
			color: transparentize(colors.$yellow, 0.3);
		}

		> :global(svg) {
			height: 1.6em;
			margin-right: 0.6em;
		}
	}
</style>
