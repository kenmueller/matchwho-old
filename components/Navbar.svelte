<script lang="ts">
	import Match from '../icons/Match.svelte'
</script>

<nav>
	<a href="/">
		<Match />
		Match Who
	</a>
</nav>

<style lang="scss">
	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.8rem 1.2rem;
		background: var(--overlay);
		border-bottom: 0.125rem solid var(--border);
	}

	a {
		display: flex;
		align-items: center;
		text-decoration: none;
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--text);
		transition: color 0.15s, opacity 0.15s;

		&:hover {
			color: var(--yellow);
			opacity: 0.7;
		}

		> :global(svg) {
			height: 1.6em;
			margin-right: 0.6em;
		}
	}
</style>
