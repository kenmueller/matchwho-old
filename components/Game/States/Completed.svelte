<script lang="ts">
	import type SavedPlayer from '../../../shared/game/saved/player.js'
	import type SavedQuestion from '../../../shared/game/saved/question.js'
	import Podium from '../Podium/Podium.svelte'

	export let players: SavedPlayer[]
	export let questions: SavedQuestion[]
</script>

<main>
	<Podium {players} />
	<h2>Questions</h2>
	{#each questions as { name, question, answers }}
		<section>
			<p class="asked">{name} asked</p>
			<h3>{question}</h3>
			{#each answers as { name, answer }}
				<p class="answer">
					<span>{name}:</span>
					{answer}
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

	.asked {
		font-weight: 700;
		opacity: 0.5;
	}

	h3 {
		max-width: max-content;
		margin: 0.1rem 0 0.5rem;
		padding: 0 1rem 0.5rem 0;
		font-size: 1.5rem;
		font-weight: 700;
		border-bottom: 0.125rem solid colors.$border;
	}

	.answer {
		& + & {
			margin-top: 0.5rem;
		}
	}

	span {
		font-weight: 700;
	}
</style>
