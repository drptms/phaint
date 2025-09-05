<script lang="ts">
	import { get, type Writable } from 'svelte/store';
	import {
		currentTool,
		currentStrokeColor,
		currentFillColor,
		currentStrokeWidth,
		isDrawing,
		canvasCursor,
		vectorDataStore,
	} from '$lib/components/CanvasStore';
	import type {
		Point,
		VectorElement,
		VectorPath,
		VectorRectangle,
		VectorCircle,
		CanvasState,
	} from '$lib/components/CanvasTypes';
	import {
		generateId,
		getCanvasCoordinates,
		findShapeAtPoint,
		vectorToSVG,
		parseSVGPath,
		saveToLocalStorage,
		downloadAsJSON
	} from '$lib/components/CanvasUtils';

	// Canvas references
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	// Constants
	const CANVAS_WIDTH = 800;
	const CANVAS_HEIGHT = 600;
	const STORAGE_KEY = 'svelteTypescriptVectorDrawing';

	// Canvas state
	let canvasState: CanvasState = {
		isDrawing: false,
		currentPath: [],
		tempShapeStart: null
	};

    // Props
	const {
		shapes,
		backgroundFill
	}: { shapes: Writable<VectorElement[]>; backgroundFill: Writable<string> } = $props();
	const vectorData = vectorDataStore(shapes, backgroundFill);


	import { onMount } from 'svelte';

	onMount(async () => {
		ctx = canvas.getContext('2d')!;
	});
	// Canvas event handlers
	function handleCanvasMouseDown(event: MouseEvent): void {
		if (get(currentTool) === 'bucket') {
			handleBucketFill(event);
		} else {
			startDrawing(event);
		}
	}

	function startDrawing(event: MouseEvent): void {
		canvasState.isDrawing = true;
		isDrawing.set(true);

		const coords = getCanvasCoordinates(event, canvas);

		if (get(currentTool) === 'pen') {
			canvasState.currentPath = [coords];
		} else {
			canvasState.tempShapeStart = coords;
		}
	}

	function handleCanvasMouseMove(event: MouseEvent): void {
		if (!canvasState.isDrawing || get(currentTool) === 'bucket') return;

		const coords = getCanvasCoordinates(event, canvas);

		if (get(currentTool) === 'pen') {
			canvasState.currentPath.push(coords);
			redrawCanvas();
		} else if (canvasState.tempShapeStart) {
			redrawCanvas();
			drawShapePreview(canvasState.tempShapeStart, coords);
		}
	}

	function handleCanvasMouseUp(event: MouseEvent): void {
		if (!canvasState.isDrawing || get(currentTool) === 'bucket') return;

		canvasState.isDrawing = false;
		isDrawing.set(false);

		const coords = getCanvasCoordinates(event, canvas);

		if (get(currentTool) === 'pen' && canvasState.currentPath.length > 1) {
			const pathShape: VectorPath = {
				id: generateId(),
				type: 'path',
				points: [...canvasState.currentPath],
				stroke: get(currentStrokeColor),
				strokeWidth: get(currentStrokeWidth),
				fill: 'none'
			};
			shapes.update((current) => [...current, pathShape]);
			canvasState.currentPath = [];
		} else if (canvasState.tempShapeStart) {
			const shape = createShapeVector(canvasState.tempShapeStart, coords);
			if (shape) {
				shapes.update((current) => [...current, shape]);
			}
			canvasState.tempShapeStart = null;
		}
	}

	function handleCanvasMouseLeave(): void {
		canvasState.isDrawing = false;
		isDrawing.set(false);
	}

	// Bucket fill implementation
	function handleBucketFill(event: MouseEvent): void {
		const coords = getCanvasCoordinates(event, canvas);
		const targetShape = findShapeAtPoint(coords, get(shapes), CANVAS_WIDTH, CANVAS_HEIGHT);

		if (targetShape) {
			// Fill the clicked shape
			shapes.update((current) => {
				return current.map((shape) => {
					if (shape.id === targetShape.id) {
						return { ...shape, fill: get(currentFillColor) };
					}
					return shape;
				});
			});
		} else {
			// Fill background
			backgroundFill.set(get(currentFillColor));
		}

		redrawCanvas();
	}

	// Shape creation
	function createShapeVector(start: Point, end: Point): VectorElement | null {
		const baseProps = {
			id: generateId(),
			stroke: get(currentStrokeColor),
			strokeWidth: get(currentStrokeWidth),
			fill: 'none'
		};

		switch (get(currentTool)) {
			case 'rectangle': {
				const rect: VectorRectangle = {
					...baseProps,
					type: 'rectangle',
					x: Math.min(start.x, end.x),
					y: Math.min(start.y, end.y),
					width: Math.abs(end.x - start.x),
					height: Math.abs(end.y - start.y)
				};
				return rect;
			}
			case 'circle': {
				const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
				const circle: VectorCircle = {
					...baseProps,
					type: 'circle',
					cx: start.x,
					cy: start.y,
					radius
				};
				return circle;
			}
			default:
				return null;
		}
	}

	// Shape preview during drawing
	function drawShapePreview(start: Point, end: Point): void {
		ctx.strokeStyle = get(currentStrokeColor);
		ctx.lineWidth = get(currentStrokeWidth);
		ctx.setLineDash([5, 5]);

		switch (get(currentTool)) {
			case 'rectangle': {
				const width = end.x - start.x;
				const height = end.y - start.y;
				ctx.strokeRect(start.x, start.y, width, height);
				break;
			}
			case 'circle': {
				const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
				ctx.beginPath();
				ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
				ctx.stroke();
				break;
			}
		}

		ctx.setLineDash([]);
	}

	// Canvas rendering
	function redrawCanvas(): void {
		if (!ctx) return;

		ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		// Draw background fill
		const bgFill = get(backgroundFill);
		if (bgFill !== 'none') {
			ctx.fillStyle = bgFill;
			ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		}

		// Draw all shapes
		get(shapes).forEach((shape) => {
			drawVectorItem(shape);
		});

		// Draw current path being drawn
		if (canvasState.currentPath.length > 1) {
			drawCurrentPath();
		}
	}

	function drawVectorItem(item: VectorElement): void {
		// Draw fill first
		if (item.fill && item.fill !== 'none') {
			ctx.fillStyle = item.fill;

			switch (item.type) {
				case 'rectangle':
					ctx.fillRect(item.x, item.y, item.width, item.height);
					break;
				case 'circle':
					ctx.beginPath();
					ctx.arc(item.cx, item.cy, item.radius, 0, 2 * Math.PI);
					ctx.fill();
					break;
				case 'path': {
					const points = item.points;
					if (points.length > 0) {
						ctx.beginPath();
						ctx.moveTo(points[0].x, points[0].y);
						for (let i = 1; i < points.length; i++) {
							ctx.lineTo(points[i].x, points[i].y);
						}
						ctx.closePath();
						ctx.fill();
					}
					break;
				}
			}
		}

		// Draw stroke
		ctx.strokeStyle = item.stroke;
		ctx.lineWidth = item.strokeWidth;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';

		switch (item.type) {
			case 'path': {
				const points = item.points;
				if (points.length > 0) {
					ctx.beginPath();
					ctx.moveTo(points[0].x, points[0].y);
					for (let i = 1; i < points.length; i++) {
						ctx.lineTo(points[i].x, points[i].y);
					}
					ctx.stroke();
				}
				break;
			}
			case 'rectangle':
				ctx.strokeRect(item.x, item.y, item.width, item.height);
				break;
			case 'circle':
				ctx.beginPath();
				ctx.arc(item.cx, item.cy, item.radius, 0, 2 * Math.PI);
				ctx.stroke();
				break;
		}
	}

	function drawCurrentPath(): void {
		if (canvasState.currentPath.length < 2) return;

		ctx.strokeStyle = get(currentStrokeColor);
		ctx.lineWidth = get(currentStrokeWidth);
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';

		ctx.beginPath();
		ctx.moveTo(canvasState.currentPath[0].x, canvasState.currentPath[0].y);
		for (let i = 1; i < canvasState.currentPath.length; i++) {
			ctx.lineTo(canvasState.currentPath[i].x, canvasState.currentPath[i].y);
		}
		ctx.stroke();
	}

	// Vector data display
	function generateVectorOutput(data: any): string {
		if (!data || (data.elements.length === 0 && data.backgroundFill === 'none')) {
			return 'Draw and fill shapes to see vector data...';
		}

		let displayText = `Svelte + TypeScript Vector Data (${data.elements.length} elements):\n\n`;

		if (data.backgroundFill !== 'none') {
			displayText += `Background Fill: ${data.backgroundFill}\n\n`;
		}

		data.elements.forEach((element: any, i: number) => {
			displayText += `Element ${i + 1} (ID: ${element.id}):\n`;
			switch (element.type) {
				case 'path':
					displayText += `  Type: Path (${element.points.length} points)\n`;
					break;
				case 'rectangle':
					displayText += `  Type: Rectangle\n`;
					displayText += `  Bounds: (${element.x}, ${element.y}) ${element.width}×${element.height}\n`;
					break;
				case 'circle':
					displayText += `  Type: Circle\n`;
					displayText += `  Center: (${element.cx}, ${element.cy}) Radius: ${element.radius.toFixed(1)}\n`;
					break;
			}

			if (element.fill && element.fill !== 'none') {
				displayText += `  Fill: ${element.fill}\n`;
			}
			displayText += `  Stroke: ${element.stroke} (${element.strokeWidth}px)\n\n`;
		});

		return displayText;
	}

	function loadVectorData(data: any): void {
		shapes.set(data.elements || []);
		backgroundFill.set(data.backgroundFill || 'none');
		redrawCanvas();
		alert('TypeScript vector drawing loaded!');
	}

	// Reactive canvas redraw when shapes change
	$effect(() => {
		if (canvas && $shapes) {
			redrawCanvas();
		}
	});

	$effect(() => {
		if (canvas && $backgroundFill) {
			redrawCanvas();
		}
	});
</script>
<canvas
    bind:this={canvas}
    width={CANVAS_WIDTH}
    height={CANVAS_HEIGHT}
    style="cursor: {$canvasCursor};"
    onmousedown={handleCanvasMouseDown}
    onmousemove={handleCanvasMouseMove}
    onmouseup={handleCanvasMouseUp}
    onmouseleave={handleCanvasMouseLeave}
></canvas>

<style>
	canvas {
		border: 3px solid #ddd;
		border-radius: 12px;
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
		background: white;
		transition: all 0.2s ease;
	}

	canvas:hover {
		box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
	}

    	@media (max-width: 768px) {

		canvas {
			width: 100%;
			max-width: 400px;
			height: auto;
		}
	}
</style>
