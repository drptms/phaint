<script lang="ts">

    let { children } = $props();
	import { selected, brush } from './shared.svelte';
	const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'white', 'black'];
	
</script>

<header>
	<div class="menu">
		<div class="colors">
			{#each colors as color}
				<button
					class="color"
					aria-label={color}
					aria-current={selected.color === color}
					style="--color: {color}"
					onclick={() => {
						selected.color = color;
					}}
				></button>
			{/each}
		</div>

		<label>
			small
			<input type="range" bind:value={brush.size} min="1" max="50" />
			large
		</label>
	</div>
</header>

<main>
	{@render children() }
</main>

<style>

    header {
        padding: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
	}

	.menu {
		position: relative;
		background: var(--bg-2);
		width: calc(100% - 2em);
		max-width: 23em;
		padding: 1em 1em 0.5em 1em;
		border-radius: 1em;
		box-sizing: border-box;
		user-select: none;
	}

	.colors {
		display: grid;
		align-items: center;
		grid-template-columns: repeat(9, 1fr);
		grid-gap: 0.5em;
	}

	.color {
		aspect-ratio: 1;
		border-radius: 50%;
		background: var(--color, #fff);
		transform: none;
		filter: drop-shadow(2px 2px 3px rgba(0,0,0,0.2));
		transition: all 0.1s;
	}

	.menu label {
		display: flex;
		width: 100%;
		margin: 1em 0 0 0;
	}

	.menu input {
		flex: 1;
	}
</style>
