<script lang="ts">
	import jsPDF from 'jspdf';

    let { children } = $props();
	import { selected, brush, bucket, selectionMode } from './shared.svelte';
	const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'black', 'white', 'bucket'];

	function exportPDF(): void {
		
		let canvases: NodeListOf<HTMLCanvasElement> = document.querySelectorAll('canvas');
		const pdf = new jsPDF({
			orientation: 'landscape',
			unit: 'px',
			format: [canvases[0].width, canvases[0].height]
		});

		canvases.forEach((canvas, index) => {
			const imgData = canvas.toDataURL('image/png');
			if (index > 0) {
				pdf.addPage([canvas.width, canvas.height], 'landscape');
			}
			pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
		});

		pdf.save('export.pdf');
	}

</script>

<header>
	<div class="menu">
		<div class="colors">
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

		<div class="selection">
			<button class:selected={selectionMode.active}  onclick={() => selectionMode.active = !selectionMode.active}>Select (icon)</button>
		</div>

		<div class="export">
			<button onclick={exportPDF}>Export</button>
		</div>
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
		max-width: 34em;
		padding: 1em 1em 0.5em 1em;
		border-radius: 1em;
		box-sizing: border-box;
		user-select: none;
		display: flex;
		align-items: center;
	}
	.colors {
		flex-grow: 1;
	}
	.colors div {
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

	.selection {
		margin-left: 1em;
	}

	.selection button {
		border-radius: 20%;
		padding: 0.5em 1em;
		cursor: pointer;
		transition: all 0.2s;
	}

	.selection button.selected {
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5); /* Effetto premuto */
        transform: translateY(2px); /* Effetto di pressione */
    }

	.export {
		margin-left: 1em;
	}

	.export button {
		border-radius: 20%;
		padding: 0.5em 1em;
		cursor: pointer;
		transition: all 0.2s;
	}

</style>
