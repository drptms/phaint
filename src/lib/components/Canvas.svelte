<script lang="ts">
	import { get, type Writable } from 'svelte/store';
	import {
		currentTool,
		currentStrokeColor,
		currentFillColor,
		currentStrokeWidth,
		isDrawing,
		canvasCursor,
		vectorDataStore, selectedShapeIds
	} from '$lib/components/CanvasStore';
	import type {
		Point,
		VectorElement,
		VectorPath,
		VectorRectangle,
		VectorCircle,
		CanvasState
	} from '$lib/components/CanvasTypes';
	import {
		generateId,
		getCanvasCoordinates,
		findShapeAtPoint,
		pointInRectangle, pointInCircle, pointInPath
	} from '$lib/components/CanvasUtils';

	// Canvas references
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	// Constants
	const CANVAS_WIDTH = 800;
	const CANVAS_HEIGHT = 600;

	// Canvas state
	let canvasState: CanvasState = {
		isDrawing: false,
		currentPath: [],
		tempShapeStart: null
	};

	// Props
	const {
		shapes,
		backgroundFill,
		timestamp,
		sendStrokes,
		sendCanvasMetadata
	}: {
		shapes: Writable<VectorElement[]>;
		backgroundFill: Writable<string>;
		timestamp: string;
		sendStrokes: (stroke: VectorElement) => void;
		sendCanvasMetadata: (color: string) => void;
	} = $props();

	const vectorData = vectorDataStore(shapes, backgroundFill, timestamp);

	let selectionMarqueeStart: Point | null = null;
	let selectionMarqueeEnd: Point | null = null;
	let dragStartPos: Point | null = null;
	let initialShapePositions: Map<string, Point> = new Map();
	let isDraggingSelection = false;
	import { onMount } from 'svelte';

	onMount(async () => {
		ctx = canvas.getContext('2d')!;
	});

	function isPointInVectorElement(point: Point, element: VectorElement): boolean {
		switch (element.type) {
			case 'rectangle':
				return pointInRectangle(point, element.x, element.y, element.width, element.height);
			case 'circle':
				return pointInCircle(point, element.cx, element.cy, element.radius);
			case 'path':
				return pointInPath(point, element.points, canvas.width, canvas.height);
			default:
				return false;
		}
	}

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	// Canvas event handlers
	function handleCanvasMouseDown(event: MouseEvent): void {
		if (get(currentTool) === 'bucket') {
			handleBucketFill(event);
		} else if (get(currentTool) === 'selection') {
			const coords = getCanvasCoordinates(event, canvas);
			selectionMarqueeStart = coords;
			selectionMarqueeEnd = coords;
			isDraggingSelection = false; // Not dragging shapes yet, just marquee
			selectedShapeIds.set(new Set()); // Clear selection at start
		} else if (get(currentTool) === 'cursor') {
			const coords = getCanvasCoordinates(event, canvas);
			get(vectorData).elements.forEach(element => {
				if (isPointInVectorElement(coords, element)) {
					dispatch('clickedElement', element);
				}
			});
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
		const coords = getCanvasCoordinates(event, canvas);
		if (get(currentTool) === 'selection') {
			if (!selectionMarqueeStart) return;
			// User is dragging marquee rectangle
			selectionMarqueeEnd = coords;
			redrawCanvas();
			drawSelectionMarquee(selectionMarqueeStart, selectionMarqueeEnd);
		} else {
			if (!canvasState.isDrawing || get(currentTool) === 'bucket') return;
			if (get(currentTool) === 'pen') {
				canvasState.currentPath.push(coords);
				redrawCanvas();
			} else if (canvasState.tempShapeStart) {
				redrawCanvas();
				drawShapePreview(canvasState.tempShapeStart, coords);
			}
		}
	}

	function handleCanvasMouseUp(event: MouseEvent): void {
		if (get(currentTool) === 'selection') {
			if (!isDraggingSelection) {
				// End marquee drag → select all shapes inside marquee rect
				const rect = getMarqueeRectangle(selectionMarqueeStart!, selectionMarqueeEnd!);
				selectShapesInRect(rect);
				selectionMarqueeStart = null;
				selectionMarqueeEnd = null;

				// Prepare for dragging if shapes selected:
				const coords = getCanvasCoordinates(event, canvas);
				if (get(selectedShapeIds).size > 0) {
					isDraggingSelection = true;
					dragStartPos = coords;
					captureInitialShapePositions();
				}
			} else {
				// End dragging shapes
				isDraggingSelection = false;
				dragStartPos = null;
				initialShapePositions.clear();
			}
		} else {
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
					fill: 'none',
					action: { type: 'none', link: ''}
				};
				shapes.update((current) => [...current, pathShape]);
				sendStrokes(pathShape)
				canvasState.currentPath = [];
			} else if (canvasState.tempShapeStart) {
				const shape = createShapeVector(canvasState.tempShapeStart, coords);
				if (shape) {
					shapes.update((current) => [...current, shape]);
					sendStrokes(shape)
				}
				canvasState.tempShapeStart = null;
			}
		}
	}

	function getMarqueeRectangle(start: Point, end: Point) {
		return {
			x: Math.min(start.x, end.x),
			y: Math.min(start.y, end.y),
			width: Math.abs(end.x - start.x),
			height: Math.abs(end.y - start.y)
		};
	}

	// Draw the dashed selection marquee rectangle
	function drawSelectionMarquee(start: Point, end: Point): void {
		if (!ctx) return;
		ctx.save();
		ctx.strokeStyle = '#3399FF';
		ctx.lineWidth = 1;
		ctx.setLineDash([6, 4]);
		const rect = getMarqueeRectangle(start, end);
		ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
		ctx.restore();
	}

	// Select shapes that are fully or partially inside the marquee rectangle
	function selectShapesInRect(rect: { x: number, y: number, width: number, height: number }): void {
		const shapesArray = get(shapes);
		const selectedIds = new Set<string>();

		shapesArray.forEach(shape => {
			const shapeBox = getBoundingBox(shape);
			if (rectsIntersect(rect, shapeBox)) {
				selectedIds.add(shape.id);
			}
		});

		selectedShapeIds.set(selectedIds);
	}

	// Get bounding box of any shape
	function getBoundingBox(shape: VectorElement): { x: number, y: number, width: number, height: number } {
		switch (shape.type) {
			case 'rectangle':
				return { x: shape.x, y: shape.y, width: shape.width, height: shape.height };
			case 'circle':
				return {
					x: shape.cx - shape.radius,
					y: shape.cy - shape.radius,
					width: shape.radius * 2,
					height: shape.radius * 2
				};
			case 'path': {
				const xs = shape.points.map(p => p.x);
				const ys = shape.points.map(p => p.y);
				return {
					x: Math.min(...xs),
					y: Math.min(...ys),
					width: Math.max(...xs) - Math.min(...xs),
					height: Math.max(...ys) - Math.min(...ys)
				};
			}
		}
	}

	// Check if two rectangles intersect (overlap)
	function rectsIntersect(r1: { x: number, y: number, width: number, height: number }, r2: {
		x: number,
		y: number,
		width: number,
		height: number
	}): boolean {
		return !(r2.x > r1.x + r1.width ||
			r2.x + r2.width < r1.x ||
			r2.y > r1.y + r1.height ||
			r2.y + r2.height < r1.y);
	}

	// Record initial shape positions before drag start for relative movement
	function captureInitialShapePositions(): void {
		initialShapePositions.clear();
		const shapesArray = get(shapes);
		const selectedIds = get(selectedShapeIds);
		shapesArray.forEach(shape => {
			if (selectedIds.has(shape.id)) {
				switch (shape.type) {
					case 'rectangle':
						initialShapePositions.set(shape.id, { x: shape.x, y: shape.y });
						break;
					case 'circle':
						initialShapePositions.set(shape.id, { x: shape.cx, y: shape.cy });
						break;
					case 'path':
						// For paths, record first point as reference
						if (shape.points.length > 0) {
							initialShapePositions.set(shape.id, { x: shape.points[0].x, y: shape.points[0].y });
						}
						break;
				}
			}
		});
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
				fill: 'none',
				action: { type: 'none', link: ''}
			};
			shapes.update((current) => [...current, pathShape]);
			sendStrokes(pathShape);
			canvasState.currentPath = [];

		} else if (canvasState.tempShapeStart) {
			const shape = createShapeVector(canvasState.tempShapeStart, coords);
			if (shape) {
				shapes.update((current) => [...current, shape]);
				sendStrokes(shape);
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
						sendStrokes({ ...shape, fill: get(currentFillColor) });
						return { ...shape, fill: get(currentFillColor) };
					}
					return shape;
				});
			});
		} else {
			// Fill background
			backgroundFill.set(get(currentFillColor));
			sendCanvasMetadata(get(currentFillColor));
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
					height: Math.abs(end.y - start.y),
					action: { type: 'none', link: ''}
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
					radius,
					action: { type: 'none', link: ''}
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
		if (item && item.fill && item.fill !== 'none') {
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

		const selectedId = get(selectedShapeIds);
		const isSelected = selectedId.has(item.id);

		if (isSelected) {
			ctx.save();
			// Draw highlight: for example, dashed blue bounding box around shape
			ctx.strokeStyle = '#007bff';
			ctx.lineWidth = 2;
			ctx.setLineDash([6, 4]);

			switch (item.type) {
				case 'rectangle':
					ctx.strokeRect(item.x - 4, item.y - 4, item.width + 8, item.height + 8);
					break;
				case 'circle':
					ctx.beginPath();
					ctx.arc(item.cx, item.cy, item.radius + 4, 0, 2 * Math.PI);
					ctx.stroke();
					break;
				case 'path': {
					// Calculate bounding box of path points
					const xs = item.points.map(p => p.x);
					const ys = item.points.map(p => p.y);
					const minX = Math.min(...xs);
					const minY = Math.min(...ys);
					const maxX = Math.max(...xs);
					const maxY = Math.max(...ys);
					ctx.strokeRect(minX - 4, minY - 4, maxX - minX + 8, maxY - minY + 8);
					break;
				}
			}
			ctx.restore();
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
