<script lang="ts">

    let { children } = $props();
	import { selected, brush, bucket } from './shared.svelte';
	const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'black', 'white', 'bucket'];
	
</script>

<header>
	<div class="menu">
		<div class="colors">
			{#each colors as color}
				{#if (color === 'bucket')}
					<label style="display:flex; flex-direction:column;">
						<img src="fill_bucket.png" style="width: 20px;" alt="bucket" />
						<select bind:value={bucket.color}>	
							{#each colors.slice(0, colors.length - 1) as color}
								<option onclick={() => selected.color = 'bucket'} class="color" value={color} style="--color: {color}"></option>
							{/each}
						</select> 
					</label>
				{:else}
					<button
						class="color"
						aria-label={color}
						aria-current={selected.color === color}
						style="--color: {color}"
						onclick={() => {
							selected.color = color;
						}}>
						{#if (color === 'white')}
							<img src="rubber.png" style="width: 100%;" alt="rubber"/>
						{/if}
					</button>
				{/if}
			{/each}
		</div>

		<label>
			small
			<input type="range" bind:value={brush.size} min="5" max="50" />
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
		max-width: 26em;
		padding: 1em 1em 0.5em 1em;
		border-radius: 1em;
		box-sizing: border-box;
		user-select: none;
	}

	.colors {
		display: grid;
		align-items: center;
		grid-template-columns: repeat(10, 1fr);
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
