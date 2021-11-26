<script lang="ts">
	export let value = 'The ultimate party game'
</script>

<svelte:head>
	<meta name="description" content={value} />
	<meta property="og:description" content={value} />
	<meta name="twitter:description" content={value} />
</svelte:head>
