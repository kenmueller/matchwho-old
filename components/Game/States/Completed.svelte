<script lang="ts">
	import type Game from '../../../shared/game/index.js'
	import Podium from '../Podium/Podium.svelte'

	export let game: Game

	$: players = [...game.players].sort((a, b) => b.points - a.points)
	$: questions = game.results?.questions ?? []
</script>

<main>
	<Podium {players} />
	{#each questions as question}
		<section>
			<h3>{question.name}</h3>
			{#each question.answers as answer}
				<article>
					<h4>{answer.name}</h4>
					<p>{answer.value}</p>
				</article>
			{/each}
		</section>
	{/each}
</main>

<style lang="scss">
	main {
		grid-area: main;
	}
</style>
