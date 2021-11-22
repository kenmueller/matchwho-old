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
				return 'Completed'
		}
	})()
</script>

<svelte:head>
	<title>{status} | Match Who</title>
</svelte:head>

<h1
	class:started={game.state === GameState.Started}
	data-round={game.round}
	data-rounds={ROUNDS}
>
	{status}
</h1>

<style lang="scss">
	@use 'shared/colors';

	h1 {
		grid-area: status;
		position: relative;
		font-size: 3rem;
		font-weight: 800;
		color: colors.$text;
	}

	.started::before {
		content: 'Round ' attr(data-round) '/' attr(data-rounds);
		position: absolute;
		bottom: 100%;
		left: 0;
		font-size: 1.2rem;
	}
</style>
