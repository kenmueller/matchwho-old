<script lang="ts">
	import type Game from '../../../shared/game/index.js'
	import GameState from '../../../shared/game/state.js'
	import GameTurnState from '../../../shared/game/turn/state.js'
	import ROUNDS from '../../../shared/game/rounds.js'
	import { MAX_PLAYERS } from '../../../shared/game/player/bounds.js'

	export let game: Game

	$: myTurn = game.turn?.player.id === game.self?.id

	$: status = (() => {
		switch (game.state) {
			case GameState.Joining:
				return `Waiting for players (${game.players.length}/${MAX_PLAYERS})`
			case GameState.Started:
				switch (game.turn?.state) {
					case GameTurnState.Waiting:
						return myTurn ? 'Ask a question' : 'Should be any time now...'
					case GameTurnState.Answering:
						return myTurn ? 'Should be any time now...' : 'Answer time!'
					case GameTurnState.Matching:
						return game.turn.correct
							? `${
									myTurn ? "You've" : `${game.turn.player.name} has`
							  } finished matching`
							: myTurn
							? 'Start matching!'
							: `${game.turn.player.name} is matching`
					default:
						return "Oops! Something isn't right"
				}
			case GameState.Completed:
				return 'Game over'
		}
	})()
</script>

<svelte:head>
	<title>{status} | Match Who</title>
</svelte:head>

<h1
	data-code={game.state === GameState.Joining ? game.code : undefined}
	data-round={game.state === GameState.Started ? game.round : undefined}
	data-rounds={game.state === GameState.Started ? ROUNDS : undefined}
>
	{status}
</h1>

<style lang="scss">
	@use 'shared/colors';

	h1 {
		grid-area: status;
		position: relative;
		font-size: 1.4rem;
		font-weight: 800;
		color: colors.$text;

		@media (min-width: 25rem) {
			font-size: 2rem;
		}

		@media (min-width: 50rem) {
			font-size: 3rem;
		}

		&::before {
			position: absolute;
			bottom: 100%;
			left: 0;
			font-size: 0.8rem;

			@media (min-width: 25rem) {
				font-size: 1rem;
			}

			@media (min-width: 50rem) {
				font-size: 1.2rem;
			}
		}
	}

	[data-code]::before {
		content: 'Game code: ' attr(data-code);
	}

	[data-round][data-rounds]::before {
		content: 'Round ' attr(data-round) '/' attr(data-rounds);
	}
</style>
