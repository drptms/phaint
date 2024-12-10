<script lang="ts">
	import { bucket } from "../../routes/(drawing)/design/shared.svelte";

	const colorMap: Map<string, Color> = new Map([
		['red', [255, 0, 0, 255]],
		['orange', [255, 165, 0, 255]],
		['yellow', [255, 255, 0, 255]],
		['green', [0, 255, 0, 255]],
		['blue', [0, 0, 255, 255]],
		['indigo', [75, 0, 130, 255]],
		['violet', [238, 130, 238, 255]],
		['black', [0, 0, 0, 255]],
		['white', [255, 255, 255, 255]]
	]);

	type Color = [number, number, number, number];
	let { color, size, pages = $bindable() } = $props();
	type Coordinates = {x: number, y: number};

	let canvas: HTMLCanvasElement | undefined = $state();
	var context: CanvasRenderingContext2D | null | undefined = $state();
	let coords: Coordinates | undefined | null = $state();

	function showCanvas() {
		//console.log(canvas?.toDataURL())
	}

	function colorsMatch(color1: Color, color2: Color): boolean {
		return color1[0] === color2[0] &&
				color1[1] === color2[1] &&
				color1[2] === color2[2] &&
				color1[3] === color2[3];
	}

	function floodFill(coords: Coordinates) {
		if (!context || !canvas) {
			return
		}
		const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
		const pixels = imageData.data;

		const startPos = (coords.y * canvas.width + coords.x) * 4;
		const startColor: Color = [
			pixels[startPos],
			pixels[startPos + 1],
			pixels[startPos + 2],
			pixels[startPos + 3]
		];
		
		const fillColor = colorMap.get(bucket.color);

		if (!fillColor) {
			return
		}
		if (colorsMatch(fillColor, startColor)) {
			return
		}

		const stack: [number, number][] = [[coords.x, coords.y]];
		const visited: Set<[number, number]> = new Set();  // Track visited pixels

		const getPixelIndex = (x: number, y: number): number => {
			if (!canvas) {
				return 0
			}
			return (y * canvas.width + x) * 4;
		}
		let count = 0;
		let count_all = 0;
		while (stack.length > 0) {
			const [currentX, currentY] = stack.pop()!;
			count_all += 1;
			// Skip if this pixel has already been visited
			if (visited.has([currentX, currentY])) continue;
			count += 1;
			visited.add([currentX, currentY]);

			const index = getPixelIndex(currentX, currentY);

			// Check if the pixel color matches the target color
			const currentColor: Color = [
				pixels[index],
				pixels[index + 1],
				pixels[index + 2],
				pixels[index + 3]
			];

			if (colorsMatch(currentColor, startColor)) {
				// Fill the current pixel
				pixels[index] = fillColor[0];
				pixels[index + 1] = fillColor[1];
				pixels[index + 2] = fillColor[2];
				pixels[index + 3] = fillColor[3];

				// Add neighboring pixels to the stack
				if (!visited.has([currentX - 1, currentY]) && currentX > 0) {
					stack.push([currentX - 1, currentY]);
				};
				if (!visited.has([currentX + 1, currentY]) && currentX < canvas.width - 1) {
					stack.push([currentX + 1, currentY]);
				};
				if (!visited.has([currentX, currentY - 1]) && currentY > 0) {
					stack.push([currentX, currentY - 1]); 
				};
				if (!visited.has([currentX, currentY + 1]) && currentY < canvas.height - 1) {
					stack.push([currentX, currentY + 1]); 
				};
			}
		}
		console.log("all = " + count_all)
		console.log("mid = " + count)
		context.putImageData(imageData, 0, 0);
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