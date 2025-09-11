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
	const distance = Math.sqrt(Math.pow(last.x - first.x, 2) + Math.pow(last.y - first.y, 2));
	return distance < threshold;
}

/**
 * Check if a point is inside a rectangle
 */
export function pointInRectangle(
	point: Point,
	x: number,
	y: number,
	width: number,
	height: number
): boolean {
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
export function pointInPath(
	point: Point,
	points: Point[],
	canvasWidth: number,
	canvasHeight: number
): boolean {
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
	vectorData.elements.forEach((element) => {
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

	commands?.forEach((cmd) => {
		const type = cmd[0];
		if (type === 'M' || type === 'L') {
			const coords = cmd
				.slice(1)
				.split(',')
				.map((n) => parseFloat(n.trim()));
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
		return saved ? (JSON.parse(saved) as VectorData) : null;
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

import { PDFArray, PDFDict, PDFDocument, rgb, PDFNumber, PDFName, PDFString, PDFContext } from 'pdf-lib';
import { PDFPage } from 'pdf-lib/cjs';

function hexToRgbNormalized(hex: string): { r: number; g: number; b: number } {
	if (hex === 'none') {
		return {
			r: 1,
			g: 1,
			b: 1
		};
	}
	const bigint = parseInt(hex.replace('#', ''), 16);
	return {
		r: ((bigint >> 16) & 255) / 255,
		g: ((bigint >> 8) & 255) / 255,
		b: (bigint & 255) / 255
	};
}

// function addLinkAnnotation(
// 	page: PDFPage,
// 	url: string,
// 	rect: [number, number, number, number],
// ) {
//
// 	let dict = PDFDict.withContext(page.doc.context);
// 	dict.set(PDFName.of("Type"), PDFName.of("Actions"));
// 	dict.set(PDFName.of('S'), PDFName.of('URI'));
// 	dict.set(PDFName.of('URI'), PDFString.of(url));
//
// 	const rectArray = PDFArray.withContext(page.doc.context);
// 	rect.forEach(n => rectArray.push(PDFNumber.of(n)));
//
// 	const linkAnnotation = page.doc.context.obj({
// 		Type: 'Annot',
// 		Subtype: 'Link',
// 		Rect: rectArray,
// 		Border: [0, 0, 0],
// 		A: dict
// 	});
//
// 	const annotsRef = page.node.Annots(); // call the getter function
// 	const annotsArray = annotsRef ? page.node.context.lookup(annotsRef) : undefined;
//
// 	let annots = [];
// 	if (annotsArray && Array.isArray(annotsArray)) {
// 		annots = annotsArray.slice();
// 	}
//
// 	const newAnnots = [...annots, linkAnnotation];
//
// 	page.node.set(
// 		PDFName.of('Annots'),
// 		page.node.context.obj(newAnnots),
// 	);
// }

function createUriActionDict(url: string, context: PDFContext): PDFDict {
	const dict = PDFDict.withContext(context);
	dict.set(PDFName.of('Type'), PDFName.of('Action'));
	dict.set(PDFName.of('S'), PDFName.of('URI'));
	dict.set(PDFName.of('URI'), PDFString.of(url));
	return dict;
}

export function addLinkAnnotation(
	page: PDFPage,
	url: string,
	rect: [number, number, number, number],
) {
	const context = page.doc.context;

	// Create the action dictionary for the link
	const actionDict = createUriActionDict(url, context);

	// Create the rectangle array for the annotation
	const rectArray = PDFArray.withContext(context);
	rect.forEach(n => rectArray.push(PDFNumber.of(n)));

	// Create the annotation dictionary
	const linkAnnotation = PDFDict.withContext(context);
	linkAnnotation.set(PDFName.of('Type'), PDFName.of('Annot'));
	linkAnnotation.set(PDFName.of('Subtype'), PDFName.of('Link'));
	linkAnnotation.set(PDFName.of('Rect'), rectArray);
	linkAnnotation.set(PDFName.of('Border'), context.obj([0, 0, 0])); // No border
	linkAnnotation.set(PDFName.of('A'), actionDict);

	// Add the annotation dictionary to the PDF document and get a reference
	const linkRef = context.register(linkAnnotation);

	// Add annotation reference to the page's /Annots array
	const annotsRef = page.node.Annots();

	if (annotsRef) {
		const annotsArray: PDFArray = context.lookup(annotsRef, PDFArray);
		if (annotsArray) {
			annotsArray.push(linkRef);
		}
	} else {
		// No existing annotations, create a new array with this annotation
		page.node.set(PDFName.of('Annots'), context.obj([linkRef]));
	}
}

export async function downloadAsPDF(canvases: VectorData[], filename: string): Promise<void> {
	const pdfDoc = await PDFDocument.create();

	for (const canvas of canvases) {
		const page = pdfDoc.addPage([canvas.width, canvas.height]);

		// Fill background color
		const bgColor = hexToRgbNormalized(canvas.backgroundFill);
		page.drawRectangle({
			x: 0,
			y: 0,
			width: canvas.width,
			height: canvas.height,
			color: rgb(bgColor.r, bgColor.g, bgColor.b)
		});

		for (const element of canvas.elements) {
			const stroke = hexToRgbNormalized(element.stroke);
			const fill = hexToRgbNormalized(element.fill);

			switch (element.type) {
				case 'path': {
					const points = element.points;
					if (points.length < 2) break;

					page.moveTo(points[0].x, canvas.height - points[0].y);
					for (let i = 0; i < points.length - 1; i++) {
						page.drawLine({
							start: {x: points[i].x, y: canvas.height - points[i].y},
							end: {x: points[i+1].x, y: canvas.height - points[i+1].y},
							thickness: element.strokeWidth,
							color: rgb(stroke.r, stroke.g, stroke.b)});
					}

					// Add link annotation along bounding box of path if action is link
					if (element.action?.type === 'link' && element.action.link) {
						// Calculate bounding box of points
						const xs = points.map((p) => p.x);
						const ys = points.map((p) => canvas.height - p.y);
						const minX = Math.min(...xs);
						const maxX = Math.max(...xs);
						const minY = Math.min(...ys);
						const maxY = Math.max(...ys);

						addLinkAnnotation(page, element.action.link, [minX, minY, maxX, maxY])
					}

					break;
				}
				case 'rectangle': {
					const y = canvas.height - (element.y + element.height);
					page.drawRectangle({
						x: element.x,
						y,
						width: element.width,
						height: element.height,
						color: rgb(fill.r, fill.g, fill.b),
						borderColor: rgb(stroke.r, stroke.g, stroke.b),
						borderWidth: element.strokeWidth
					});

					if (element.action?.type === 'link' && element.action.link) {
						addLinkAnnotation(page, element.action.link, [element.x, y, element.x + element.width, y + element.height])
					}

					break;
				}
				case 'circle': {
					const centerY = canvas.height - element.cy;
					page.drawCircle({
						x: element.cx,
						y: centerY,
						size: element.radius * 2,
						color: rgb(fill.r, fill.g, fill.b),
						borderColor: rgb(stroke.r, stroke.g, stroke.b),
						borderWidth: element.strokeWidth
					});

					if (element.action?.type === 'link' && element.action.link) {
						// Circle bounding box for annotation
						const left = element.cx - element.radius;
						const bottom = centerY - element.radius;
						const right = element.cx + element.radius;
						const top = centerY + element.radius;

						addLinkAnnotation(page, element.action.link, [left, bottom, right, top])
					}

					break;
				}
			}
		}
	}
	const pdfBytes = await pdfDoc.save();

	// Trigger download in browser
	const blob = new Blob([pdfBytes], { type: 'application/pdf' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = 'vector_canvases_with_links.pdf';
	a.click();
	URL.revokeObjectURL(url);
}
