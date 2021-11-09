<script lang="ts" context="module">
	export const load: Load = ({ page }) => ({
		props: { code: page.params.code }
	})
</script>

<script lang="ts">
	import type { Load } from '@sveltejs/kit'

	export let code: string
</script>

<h1>{code}</h1>

<style lang="scss">
	@use 'shared/colors';

	h1 {
		color: colors.$text;
	}
</style>
