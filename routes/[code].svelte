<script lang="ts" context="module">
	export const load: Load = async ({ page, session, fetch }) => {
		const { code } = page.params

		if (browser) {
			const response = await fetch(`${ORIGIN}/games/${code}`)
			if (!response.ok) return { status: 307, redirect: '/' }

			return {
				props: {
					code,
					leader: (await response.json()).leader
				}
			}
		}

		const { gameMeta }: Session = session
		if (!gameMeta) return { status: 307, redirect: '/' }

		return {
			props: { code, leader: gameMeta.leader }
		}
	}
</script>

<script lang="ts">
	import type { Load } from '@sveltejs/kit'
	import { onDestroy } from 'svelte'

	import { browser } from '$app/env'

	import ORIGIN from '../lib/origin'
	import SOCKET_ORIGIN from '../lib/origin/socket'
	import type Session from '../lib/session'
	import type Game from '../lib/game'
	import type IncomingGameData from '../lib/game/data/incoming'
	import handleError from '../lib/error/handle'
	import Navbar from '../components/Navbar.svelte'
	import GameView from '../components/Game/View.svelte'

	export let code: string
	export let leader: string | null

	let input: HTMLInputElement | null = null
	$: input?.focus()

	let socket: WebSocket | null = null
	let name = ''

	let game: Game | null = null

	// $: socket?.addEventListener('message', ({ data }) => {
	// 	try {
	// 		const { key, value }: IncomingGameData = JSON.parse(data)

	// 		switch (key) {
	// 			case 'game':
	// 				game = value
	// 				break
	// 		}
	// 	} catch (error) {
	// 		handleError(error)
	// 	}
	// })

	const join = () => {
		socket = new WebSocket(
			`${SOCKET_ORIGIN}/games/${code}?name=${encodeURIComponent(name)}`
		)
		socket?.addEventListener('message', ({ data }) => {
			try {
				const { key, value }: IncomingGameData = JSON.parse(data)

				switch (key) {
					case 'game':
						game = value
						break
				}
			} catch (error) {
				handleError(error)
			}
		})
	}

	onDestroy(() => socket?.close())
</script>

<svelte:head>
	<meta name="description" content="Match Who" />
	<title>
		{socket ? 'Game in Progress' : `Join ${leader ?? 'Game'}`} | Match Who
	</title>
</svelte:head>

{#if socket && game}
	<GameView {socket} {game} />
{:else}
	<div class="root">
		<Navbar />
		<form on:submit|preventDefault={join}>
			<input placeholder="Name" bind:this={input} bind:value={name} />
			<button class="join" disabled={!name}>Join Game</button>
		</form>
	</div>
{/if}

<style lang="scss">
	@use 'shared/colors';

	.root {
		display: grid;
		grid: auto 1fr / 1fr;
		height: 100%;
	}

	form {
		display: flex;
		flex-direction: column;
		justify-content: center;
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
		border-radius: 1rem;
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
