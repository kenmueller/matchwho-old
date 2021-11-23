<script lang="ts">
	import Navbar from './Navbar.svelte'

	export let visible = true
</script>

{#if visible}
	<div class="root">
		<Navbar>
			<slot name="items" />
		</Navbar>
		<div class="content">
			<slot />
		</div>
	</div>
{:else}
	<slot />
{/if}

<style lang="scss">
	.root {
		display: grid;
		grid: auto 1fr / 1fr;
		height: 100%;
	}

	.content {
		display: flex;
		flex-direction: column;
		overflow-y: auto;
	}
</style>
