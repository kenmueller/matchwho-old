<script lang="ts" context="module">
	export const load: Load = ({ page }) => ({
		props: { id: page.params.id }
	})
</script>

<script lang="ts">
	import type { Load } from '@sveltejs/kit'

	export let id: string
</script>

<h1>{id}</h1>

<style lang="scss">
	@use 'shared/colors';

	h1 {
		color: colors.$text;
	}
</style>
