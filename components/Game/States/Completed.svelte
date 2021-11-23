<script lang="ts">
	import type Game from '../../../shared/game/index.js'
	import Podium from '../Podium/Podium.svelte'

	export let game: Game

	$: players = game.results?.players ?? []
	$: questions = game.results?.questions ?? []
</script>

<main>
	<Podium {players} />
	<h2>Questions</h2>
	{#each questions as question}
		<section>
			<h3>{question.name}</h3>
			{#each question.answers as answer}
				<p>
					<span>{answer.name}:</span>
					{answer.value}
				</p>
			{/each}
		</section>
	{/each}
</main>

<style lang="scss">
	@use 'shared/colors';

	main {
		grid-area: main;
		padding-bottom: 2rem;
		color: colors.$text;
	}

	h2 {
		margin-top: 3rem;
		font-size: 2rem;
		font-weight: 700;
	}

	section {
		margin-top: 1.5rem;
	}

	h3 {
		max-width: max-content;
		margin-bottom: 0.5rem;
		padding: 0 1rem 0.5rem 0;
		font-size: 1.5rem;
		font-weight: 700;
		border-bottom: 0.125rem solid colors.$border;
	}

	p + p {
		margin-top: 0.5rem;
	}

	span {
		font-weight: 700;
	}
</style>
