<script lang="ts">
	import defaultIcon from '../../shared/icon.svg'
	import defaultImage from '../../shared/preview.jpg'

	export let icon = defaultIcon
	export let value = defaultImage
</script>

<svelte:head>
	<link rel="icon" href={icon} />

	<meta property="og:image" content={value} />
	<meta name="twitter:image" content={value} />
</svelte:head>
