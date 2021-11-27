<script lang="ts">
	import { goto } from '$app/navigation'

	import CODE_LENGTH from '../shared/game/code.js'
	import handleError from '../lib/error/handle.js'
	import MetaImage from '../components/Meta/Image.svelte'
	import MetaTitle from '../components/Meta/Title.svelte'
	import MetaDescription from '../components/Meta/Description.svelte'
	import WithNavbar from '../components/Navigation/WithNavbar.svelte'

	let input: HTMLInputElement | null = null
	$: input?.focus()

	let creating = false
	let joining = false

	let code = ''

	const create = async () => {
		try {
			if (creating) return
			creating = true

			const response = await fetch('/games', { method: 'POST' })
			if (!response.ok) throw new Error(await response.text())

			await goto(`/${await response.text()}`)
		} catch (error) {
			creating = false
			handleError(error)
		}
	}

	const join = async () => {
		try {
			if (joining) return
			joining = true

			code = code.toLowerCase()

			const response = await fetch(`/games/${code}/exists`)
			if (!response.ok) throw new Error(await response.text())

			const exists: boolean = await response.json()
			if (!exists) throw new Error('Game not found')

			await goto(`/${code}`)
		} catch (error) {
			joining = false
			handleError(error)
		}
	}
</script>

<MetaImage />
<MetaTitle />
<MetaDescription />

<WithNavbar>
	<main>
		<button class="create" aria-busy={creating} on:click={create}>
			Create Game
		</button>
		<hr />
		<form on:submit|preventDefault={join}>
			<input
				placeholder="Game code"
				maxlength={CODE_LENGTH}
				bind:this={input}
				bind:value={code}
			/>
			<button
				class="join"
				aria-busy={joining}
				disabled={code.length < CODE_LENGTH}
			>
				Join Game
			</button>
		</form>
	</main>
</WithNavbar>

<style lang="scss">
	@use 'sass:math';
	@use 'shared/colors';

	$horizontal-min-width: 31.25rem;

	main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: auto;

		@media (min-width: $horizontal-min-width) {
			flex-direction: row;
		}
	}

	.create,
	.join {
		font-weight: 700;
		color: colors.$yellow;
		background: transparentize(colors.$yellow, 0.6);
		border: 0.125rem solid transparent;
		border-radius: 1rem;
		transition: background 0.15s, border-color 0.15s, opacity 0.15s;

		&:hover {
			background: transparent;
			border-color: colors.$yellow;
		}

		&[aria-busy='true'],
		&:disabled {
			pointer-events: none;
		}

		&:disabled {
			opacity: 0.5;
		}
	}

	.create {
		padding: 1rem 1.4rem;
		font-size: 1.5rem;
	}

	hr {
		$thickness: 0.125rem;

		max-height: 8rem;
		width: 90%;
		height: $thickness;
		margin: 2rem 0;
		background: colors.$border;
		border-radius: math.div($thickness, 2);

		@media (min-width: $horizontal-min-width) {
			width: $thickness;
			height: 100%;
			margin: 0 2rem;
		}
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	input {
		padding: 0.4rem 0.6rem;
		font-weight: 600;
		color: colors.$yellow;
		background: transparent;
		border: 0.125rem solid colors.$yellow;
		border-radius: 0.8rem;
		transition: background 0.15s;

		&:hover,
		&:focus {
			background: transparentize(colors.$yellow, 0.9);
		}
	}

	.join {
		margin-top: 0.8rem;
		padding: 0.4rem 0.8rem;
		font-size: 1.1rem;
	}
</style>
