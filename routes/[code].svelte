<script lang="ts" context="module">
	export const load: Load = async ({ page, session, fetch }) => {
		try {
			const { code } = page.params
			const meta = await getMeta(code, { session, fetch })

			if (meta.next !== null) return { status: 301, redirect: `/${meta.next}` }

			return {
				props: { code, meta }
			}
		} catch (error) {
			if (error instanceof ErrorWithPayload) return error.payload
			if (error instanceof Error) return { error }

			return { error: 'An unknown error occurred' }
		}
	}
</script>

<script lang="ts">
	import type { Load } from '@sveltejs/kit'
	import { onMount, onDestroy } from 'svelte'

	import SOCKET_ORIGIN from '../lib/origin/socket.js'
	import MAX_NAME_LENGTH from '../shared/game/name.js'
	import type Game from '../shared/game/index.js'
	import type GameMeta from '../shared/game/meta.js'
	import type ServerGameData from '../shared/game/data/server.js'
	import GameState from '../shared/game/state.js'
	import getMeta from '../lib/meta/get.js'
	import ErrorWithPayload from '../shared/error/payload.js'
	import handleError from '../lib/error/handle.js'
	import WithNavbar from '../components/Navigation/WithNavbar.svelte'
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

	$: {
		const next = game?.results?.next ?? null
		if (next !== null) window.location.href = `/${next}`
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
{:else if meta.state === GameState.Joining}
	<WithNavbar>
		<form on:submit|preventDefault={join}>
			<input
				placeholder="Name"
				maxlength={MAX_NAME_LENGTH}
				bind:this={input}
				bind:value={name}
			/>
			<button aria-busy={joining} disabled={!name}>Join Game</button>
		</form>
	</WithNavbar>
{/if}

<style lang="scss">
	@use 'shared/colors';

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
</style>
