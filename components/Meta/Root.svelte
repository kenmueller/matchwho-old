<script lang="ts">
	import { page } from '$app/stores'

	import ORIGIN from '../../lib/origin/index.js'

	$: url = new URL($page.path, ORIGIN)
</script>

<svelte:head>
	<link rel="canonical" href={url.href} />

	<meta property="og:url" content={url.href} />
	<meta property="og:site_name" content="Match Who" />
	<meta property="og:type" content="website" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@matchwho" />
	<meta name="twitter:creator" content="@matchwho" />
	<meta name="twitter:domain" content={url.host} />
	<meta name="twitter:url" content={url.href} />
</svelte:head>
