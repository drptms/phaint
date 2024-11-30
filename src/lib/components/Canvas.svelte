<script lang="ts">

	let { color, size, pages = $bindable() } = $props();
	type Coordinates = {x: number, y: number};

	let canvas: HTMLCanvasElement | undefined = $state();
	var context: CanvasRenderingContext2D | null | undefined = $state();
	let coords: Coordinates | undefined | null = $state();

	function showCanvas() {
		//console.log(canvas?.toDataURL())
	}

	$effect(() => {
		if (!canvas) {
			return
		}
		context = canvas.getContext('2d');

		canvas.width = window.innerWidth - window.innerWidth * 0.05
		canvas.height = window.innerHeight - window.innerHeight * 0.05

		return
	});
</script>

<div class="container">
	<canvas
		bind:this={canvas}
		onclick="{showCanvas}"
		onpointerdown={(e) => {
			coords = { x: e.offsetX, y: e.offsetY };
			if (!context) {
				return
			}
			context.fillStyle = color;
			context.beginPath();
			context.arc(coords.x, coords.y, size / 2, 0, 2 * Math.PI);
			context.fill();
		}}
		onpointerleave={() => {
			coords = null;
		}}
		onpointermove={(e) => {
			const previous = coords;
			coords = { x: e.offsetX, y: e.offsetY };
			if (e.buttons === 1) {
				e.preventDefault();
				if (!context || !previous) {
					return
				}
				context.strokeStyle = color;
				context.lineWidth = size;
				context.lineCap = 'round';
				context.beginPath();
				context.moveTo(previous.x, previous.y);
				context.lineTo(coords.x, coords.y);
				context.stroke();
			}
		}}
	></canvas>
</div>

<footer>
	<div class="coords">
		<p>
			{#if coords}
				x: {coords?.x}, y: {coords?.y}
			{/if}
		</p>
	</div>
	{#if pages >= 2}
		<button onclick={() => pages--}>-</button>
	{/if}
	<p class="pages">{pages}</p>
	<button onclick={() => pages++}>+</button>
</footer>

<style>

	footer {
		bottom: 0;
		left: 0;
		height: 5%;
		position: fixed;
		background-color: rgb(198, 198, 198);
		border-top: 2px solid black;
		width: 100%;
	}
	
	footer .coords {
		display: inline-block;
		margin-left: 1em;
	}
	
	footer .pages {
		display: inline-block;
		margin-left: 1em;
	}
	
	footer button {
		margin-left: 1em;
		display: inline-block;
	}


	canvas {
		position: relative;
		align-self: center;
		align-content: center;
		top: 5px;
		cursor: crosshair;
		border: 1px solid black;
		margin-bottom: 5%;
	}

	.container {
		text-align: center;
	}

</style>