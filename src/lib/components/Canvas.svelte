<script lang="ts">
	import { bucket, selectionMode } from "../../routes/(drawing)/design/shared.svelte";
	import ViteWorker from "../../routes/(drawing)/design/floodworker.svelte?worker";
	import { onMount, onDestroy } from 'svelte';

	let { color, size, pages = $bindable() } = $props();
	type Coordinates = {x: number, y: number};

	let canvas: HTMLCanvasElement | undefined = $state();
	var context: CanvasRenderingContext2D | null | undefined = $state();
	let coords: Coordinates | undefined | null = $state();

	let selector: HTMLElement;
	let container: HTMLElement;
	let startX = 0;
	let startY = 0;
	let mousedown = false;

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

		container.addEventListener('mousedown', (e) => {

		});

		container.addEventListener('mousemove', (e) => {

		});
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

<div class="container" bind:this={container}>
	<div class="selector" bind:this={selector}></div>
	<canvas
		bind:this={canvas}
		onclick="{showCanvas}"
		onpointerdown={(e) => {
			coords = { x: e.offsetX, y: e.offsetY };
			if (!context || !canvas) {
				return
			}
			if (color === "bucket") {
				floodFill(coords);
				return
			}
			if (selectionMode.active) {
				selector.style.visibility = 'visible';
				selector.style.width = '0px';
				selector.style.height = '0px';
				startX = coords.x + canvas.offsetLeft;
				startY = coords.y + canvas.offsetTop;
				selector.style.left = `${startX}px`;
				selector.style.top = `${startY}px`;
				console.log(startX, startY)
				mousedown = true;
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
			e.preventDefault();
			if (!context || !previous || e.buttons !== 1 || !canvas) {
				return
			}

			if (selectionMode.active) {
				if (!mousedown) {
					return
				}
				const currentX = coords.x + canvas.offsetLeft;
				const currentY = coords.y + canvas.offsetTop;
				let width = currentX - startX;
				let height = currentY - startY;

				if (currentX - startX < 0) {
					selector.style.left = `${currentX}px`;
					width = startX - currentX;
				}
				if (currentY - startY < 0) {
					selector.style.top = `${currentY}px`;
					height = startY - currentY;
				}

				selector.style.width = `${width}px`;
				selector.style.height = `${height}px`;
				return
			}

			if (color !== 'bucket') {
				
				context.strokeStyle = color;
				context.lineWidth = size;
				context.lineCap = 'round';
				context.beginPath();
				context.moveTo(previous.x, previous.y);
				context.lineTo(coords.x, coords.y);
				context.stroke();
			}
		}}
		onpointerup={(_) => {
			if (selectionMode.active) {
				if (!context || !canvas) {
					return
				}
				mousedown = false;
				const selectedStartX = parseInt(selector.style.left) - canvas.offsetLeft;
				const selectedStartY = parseInt(selector.style.top) - canvas.offsetTop;
				const selectedStartWidth = parseInt(selector.style.width);
				const selectedStartHeight = parseInt(selector.style.height);

				
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

	.selector {
		visibility: hidden;
		position: absolute;
		width: 0;
		height: 0;
		border: 2px dashed black;
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