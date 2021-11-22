<script lang="ts" context="module">
	export const load: Load = async ({ page, session, fetch }) => {
		try {
			const { code } = page.params

			if (browser) {
				const response = await fetch(`${ORIGIN}/games/${code}`)
				if (!response.ok) return { status: 307, redirect: '/' }

				return {
					props: { code, meta: await response.json() }
				}
			}

			const { gameMeta: meta }: Session = session
			if (!meta) return { status: 307, redirect: '/' }

			return {
				props: { code, meta }
			}
		} catch (error) {
			return {
				error: error instanceof Error ? error : 'An unknown error occurred'
			}
		}
	}
</script>

<script lang="ts">
	import type { Load } from '@sveltejs/kit'
	import { onMount, onDestroy } from 'svelte'

	import { browser } from '$app/env'

	import ORIGIN from '../lib/origin/index.js'
	import SOCKET_ORIGIN from '../lib/origin/socket.js'
	import type Session from '../lib/session.js'
	import type Game from '../shared/game/index.js'
	import type GameMeta from '../shared/game/meta.js'
	import type ServerGameData from '../shared/game/data/server.js'
	import GameState from '../shared/game/state.js'
	import handleError from '../lib/error/handle.js'
	import Navbar from '../components/Navbar.svelte'
	import GameView from '../components/Game/View.svelte'

	export let code: string
	export let meta: GameMeta

	let input: HTMLInputElement | null = null
	$: input?.focus()

	let socket: WebSocket | null = null
	let game: Game | null = null

	let name = ''
	$: joining = socket !== null && !game

	const join = () => {
		if (joining) return

		socket = new WebSocket(
			`${SOCKET_ORIGIN}/games/${code}?name=${encodeURIComponent(name)}`
		)

		socket.addEventListener('message', ({ data }) => {
			try {
				const { key, value }: ServerGameData = JSON.parse(data)

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

	onMount(() => meta.state === GameState.Started && join())
	onDestroy(() => socket?.close())
</script>

<svelte:head>
	<meta name="description" content="Match Who" />
	<title>Join {meta.leader ?? 'Game'} | Match Who</title>
</svelte:head>

{#if socket && game}
	<GameView {socket} {game} />
{:else if meta.state !== GameState.Started}
	<div class="root">
		<Navbar />
		{#if meta.state === GameState.Joining}
			<form on:submit|preventDefault={join}>
				<input placeholder="Name" bind:this={input} bind:value={name} />
				<button aria-busy={joining} disabled={!name}>Join Game</button>
			</form>
		{:else if meta.state === GameState.Completed}
			<h1>This game has ended</h1>
		{/if}
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

	button {
		margin-top: 0.8rem;
		padding: 0.4rem 0.8rem;
		font-size: 1.1rem;
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

	h1 {
		justify-self: center;
		align-self: center;
		text-align: center;
		font-size: 2rem;
		font-weight: 800;
		color: colors.$text;
	}
</style>
