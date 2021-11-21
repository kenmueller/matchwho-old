<script lang="ts">
	import { goto } from '$app/navigation'

	import CODE_LENGTH from '../shared/game/code.js'
	import handleError from '../lib/error/handle.js'
	import Navbar from '../components/Navbar.svelte'

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

			const response = await fetch(`/games/${code}`)
			if (!response.ok) throw new Error(await response.text())

			await goto(`/${code}`)
		} catch (error) {
			joining = false
			handleError(error)
		}
	}
</script>

<svelte:head>
	<title>Match Who</title>
</svelte:head>

<div class="root">
	<Navbar />
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
</div>

<style lang="scss">
	@use 'sass:math';
	@use 'shared/colors';

	.root {
		display: grid;
		grid: auto 1fr / 1fr;
		height: 100%;
	}

	main {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.create,
	.join {
		font-weight: 700;
		color: colors.$yellow;
		background: transparentize(colors.$yellow, 0.6);
		border: 0.125rem solid transparent;
		border-radius: 1rem;
		transition: background 0.15s, border-color 0.15s, opacity 0.15s;

		&[aria-busy='false']:not(:disabled):hover {
			background: transparent;
			border-color: colors.$yellow;
		}

		&[aria-busy='true'] {
			cursor: default;
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
		$width: 0.125rem;

		max-height: 8rem;
		height: 100%;
		width: $width;
		margin: 0 2rem;
		background: colors.$border;
		border-radius: math.div($width, 2);
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
