<script lang="ts">
	import { goto } from '$app/navigation'

	import Navbar from '../components/Navbar.svelte'

	const length = 6

	let code = ''
	$: code = code.toLowerCase()

	const create = () => {}

	const join = () => {
		goto(`/${code}`)
	}
</script>

<svelte:head>
	<title>Match Who</title>
</svelte:head>

<div class="root">
	<Navbar />
	<main>
		<button class="create" on:click={create}>Create Game</button>
		<hr />
		<form on:submit|preventDefault={join}>
			<input placeholder="Game Code" bind:value={code} maxlength={length} />
			<button class="join" disabled={code.length < length}>Join Game</button>
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

	.create {
		padding: 1rem 1.4rem;
		font-size: 1.5rem;
		font-weight: 700;
		color: colors.$yellow;
		background: transparentize(colors.$yellow, 0.6);
		border: 0.125rem solid transparent;
		border-radius: 1rem;
		transition: background 0.15s, border-color 0.15s;

		&:hover {
			background: transparent;
			border-color: colors.$yellow;
		}
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
		font-weight: 700;
		color: colors.$yellow;
		background: transparentize(colors.$yellow, 0.6);
		border: 0.125rem solid transparent;
		border-radius: 0.8rem;
		transition: background 0.15s, border-color 0.15s, opacity 0.15s;

		&:not(:disabled):hover {
			background: transparent;
			border-color: colors.$yellow;
		}

		&:disabled {
			opacity: 0.5;
		}
	}
</style>
