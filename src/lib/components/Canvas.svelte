<script lang="ts">
	let { color, size } = $props();
	type Coordinates = {x: number, y: number};

	let canvas: HTMLCanvasElement | undefined = $state();
	var context: CanvasRenderingContext2D | null | undefined = $state();
	let coords: Coordinates | undefined | null = $state();

	$effect(() => {
		if (!canvas) {
			return
		}
		context = canvas.getContext('2d');
		
		//window.addEventListener('resize', resize);
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		return
	});
</script>

<canvas
	bind:this={canvas}
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

{#if coords}
	<div
		class="preview"
		style="--color: {color}; --size: {size}px; --x: {coords.x}px; --y: {coords.y}px"
	></div>
	<p>x: {coords.x}, y: {coords.y}</p>
{/if}

<style>
	canvas {
		position: relative;
		left: 0;
		top: 5px;
		width: 100%;
        background-color: aquamarine;
	}

	.preview {
		position: absolute;
		left: var(--x);
		top: var(--y);
		width: var(--size);
		height: var(--size);
		transform: translate(-50%, -50%);
		background: var(--color);
		border-radius: 50%;
		opacity: 0.5;
		pointer-events: none;
	}
</style>