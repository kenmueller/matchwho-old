<script lang="ts" context="module">
	export const load: Load = () => ({
		status: HttpErrorCode.TemporaryRedirect,
		redirect: '/'
	})
</script>

<script lang="ts">
	import type { Load } from '@sveltejs/kit'

	import { HttpErrorCode } from '../shared/error/http.js'
</script>
