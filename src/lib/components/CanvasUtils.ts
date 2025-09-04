// Utility functions for the vector drawing application
import type { Point, VectorElement, VectorPath, SVGElement, VectorData } from './CanvasTypes';

/**
 * Generate a unique ID for vector elements
 */
export function generateId(): string {
	return `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get canvas coordinates from mouse event
 */
export function getCanvasCoordinates(event: MouseEvent, canvas: HTMLCanvasElement): Point {
	const rect = canvas.getBoundingClientRect();
	return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top
	};
}

export function isPathClosed(points: Point[], threshold: number = 10): boolean {
	if (points.length < 3) return false;
	const first = points[0];
	const last = points[points.length - 1];
	const distance = Math.sqrt(
		Math.pow(last.x - first.x, 2) + Math.pow(last.y - first.y, 2)
	);
	return distance < threshold;
}

/**
 * Check if a point is inside a rectangle
 */
export function pointInRectangle(point: Point, x: number, y: number, width: number, height: number): boolean {
	return point.x >= x && point.x <= x + width && point.y >= y && point.y <= y + height;
}

/**
 * Check if a point is inside a circle
 */
export function pointInCircle(point: Point, cx: number, cy: number, radius: number): boolean {
	const dx = point.x - cx;
	const dy = point.y - cy;
	const distance = Math.sqrt(dx * dx + dy * dy);
	return distance <= radius;
}

/**
 * Check if a point is inside a path using canvas hit testing
 */
export function pointInPath(point: Point, points: Point[], canvasWidth: number, canvasHeight: number): boolean {
	if (points.length < 3) return false;

	const testCanvas = document.createElement('canvas');
	const testCtx = testCanvas.getContext('2d');
	if (!testCtx) return false;

	testCanvas.width = canvasWidth;
	testCanvas.height = canvasHeight;

	testCtx.beginPath();
	testCtx.moveTo(points[0].x, points[0].y);
	for (let i = 1; i < points.length; i++) {
		testCtx.lineTo(points[i].x, points[i].y);
	}
	testCtx.closePath();

	return testCtx.isPointInPath(point.x, point.y);
}

/**
 * Find the topmost shape that contains a given point
 */
export function findShapeAtPoint(
	point: Point,
	shapes: VectorElement[],
	canvasWidth: number,
	canvasHeight: number
): VectorElement | null {
	// Search from top to bottom (last drawn first)
	for (let i = shapes.length - 1; i >= 0; i--) {
		const shape = shapes[i];

		switch (shape.type) {
			case 'rectangle':
				if (pointInRectangle(point, shape.x, shape.y, shape.width, shape.height)) {
					return shape;
				}
				break;
			case 'circle':
				if (pointInCircle(point, shape.cx, shape.cy, shape.radius)) {
					return shape;
				}
				break;
			case 'path':
				if (pointInPath(point, shape.points, canvasWidth, canvasHeight)) {
					return shape;
				}
				break;
		}
	}
	return null;
}

/**
 * Convert vector data to SVG format
 */
export function vectorToSVG(vectorData: VectorData): SVGElement[] {
	const svgElements: SVGElement[] = [];

	// Background fill
	if (vectorData.backgroundFill !== 'none') {
		svgElements.push({
			type: 'rect',
			x: 0,
			y: 0,
			width: vectorData.width,
			height: vectorData.height,
			fill: vectorData.backgroundFill,
			stroke: 'none',
			strokeWidth: 0
		});
	}

	// All shapes
	vectorData.elements.forEach(element => {
		switch (element.type) {
			case 'path':
				if (element.points.length > 1) {
					let pathData = `M${element.points[0].x},${element.points[0].y}`;
					for (let i = 1; i < element.points.length; i++) {
						pathData += ` L${element.points[i].x},${element.points[i].y}`;
					}
					if (isPathClosed(element.points)) {
						pathData += ' Z';
					}

					svgElements.push({
						type: 'path',
						d: pathData,
						stroke: element.stroke,
						strokeWidth: element.strokeWidth,
						fill: element.fill || 'none'
					});
				}
				break;
			case 'rectangle':
				svgElements.push({
					type: 'rect',
					x: element.x,
					y: element.y,
					width: element.width,
					height: element.height,
					stroke: element.stroke,
					strokeWidth: element.strokeWidth,
					fill: element.fill || 'none'
				});
				break;
			case 'circle':
				svgElements.push({
					type: 'circle',
					cx: element.cx,
					cy: element.cy,
					r: element.radius,
					stroke: element.stroke,
					strokeWidth: element.strokeWidth,
					fill: element.fill || 'none'
				});
				break;
		}
	});

	return svgElements;
}

/**
 * Parse SVG path data back to points
 */
export function parseSVGPath(pathData: string): Point[] {
	const points: Point[] = [];
	const commands = pathData.match(/[MLZ][^MLZ]*/g);

	commands?.forEach(cmd => {
		const type = cmd[0];
		if (type === 'M' || type === 'L') {
			const coords = cmd.slice(1).split(',').map(n => parseFloat(n.trim()));
			if (coords.length === 2) {
				points.push({ x: coords[0], y: coords[1] });
			}
		}
	});

	return points;
}

/**
 * Save vector data to localStorage
 */
export function saveToLocalStorage(key: string, data: VectorData): void {
	try {
		localStorage.setItem(key, JSON.stringify(data));
	} catch (error) {
		console.error('Failed to save to localStorage:', error);
		throw new Error('Failed to save drawing data');
	}
}

/**
 * Load vector data from localStorage
 */
export function loadFromLocalStorage(key: string): VectorData | null {
	try {
		const saved = localStorage.getItem(key);
		return saved ? JSON.parse(saved) as VectorData : null;
	} catch (error) {
		console.error('Failed to load from localStorage:', error);
		return null;
	}
}

/**
 * Download data as JSON file
 */
export function downloadAsJSON(data: VectorData, filename: string): void {
	const dataStr = JSON.stringify(data, null, 2);
	const dataBlob = new Blob([dataStr], { type: 'application/json' });
	const url = URL.createObjectURL(dataBlob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
}