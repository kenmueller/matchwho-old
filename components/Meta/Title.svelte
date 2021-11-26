<script lang="ts">
	export let value = 'Match Who'
</script>

<svelte:head>
	<title>{value}</title>
	<meta property="og:title" content={value} />
	<meta name="twitter:title" content={value} />
</svelte:head>
