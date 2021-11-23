<script lang="ts">
	import Navbar from './Navbar.svelte'

	export let visible = true
</script>

{#if visible}
	<div>
		<Navbar>
			<slot name="items" />
		</Navbar>
		<slot />
	</div>
{:else}
	<slot />
{/if}

<style lang="scss">
	div {
		display: grid;
		grid: auto 1fr / 1fr;
		height: 100%;
	}
</style>
