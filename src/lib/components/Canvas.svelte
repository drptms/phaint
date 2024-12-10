<script lang="ts">
	import { bucket } from "../../routes/(drawing)/design/shared.svelte";
	import ViteWorker from "../../routes/(drawing)/design/floodworker.svelte?worker";
	import { onMount, onDestroy } from 'svelte';

	let { color, size, pages = $bindable() } = $props();
	type Coordinates = {x: number, y: number};

	let canvas: HTMLCanvasElement | undefined = $state();
	var context: CanvasRenderingContext2D | null | undefined = $state();
	let coords: Coordinates | undefined | null = $state();

	function showCanvas() {
		//console.log(canvas?.toDataURL())
	}

	let worker: Worker;

	onMount(() => {
		worker = new ViteWorker(); // Adjust the path if necessary

		worker.onmessage = (event) => {
			if (!context) {
				return
			}
			const updatedCanvasData = event.data;

			if (updatedCanvasData.message === "error") {
				return
			}
			context.putImageData(new ImageData(updatedCanvasData.data, updatedCanvasData.width, updatedCanvasData.height), 0, 0);
		};
	});

	onDestroy(() => {
		if (worker) {
			worker.terminate();
		}
	});

  	function floodFill(coords: Coordinates) {
		// Send data to the worker
		if (!context || !canvas) {
			return
		}
		const canvasData = context.getImageData(0, 0, canvas.width, canvas.height);
		worker.postMessage({ x: coords.x, y: coords.y, data: canvasData.data, width: canvasData.width, heigth: canvasData.height, color: bucket.color });
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
			if (color === "bucket") {
				floodFill(coords);
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

			if (e.buttons === 1 && color !== 'bucket') {
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
	<button disabled={pages<2} onclick={() => pages--}>-</button>
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