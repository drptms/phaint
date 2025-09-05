// Svelte stores for the vector drawing application
import { writable, derived, type Writable } from 'svelte/store';
import type { VectorElement, DrawingTool, VectorData, DrawingStats, CanvasType } from './CanvasTypes';
import type { WorkBoardState } from '$lib/api/websocket.svelte';

// Drawing state stores
export const currentTool = writable<DrawingTool>('pen' as DrawingTool);
export const currentStrokeColor = writable<string>('#000000');
export const currentFillColor = writable<string>('#FF0000');
export const currentStrokeWidth = writable<number>(2);


export function createShapesStore(elements?: VectorElement[]) {
	return writable<VectorElement[]>(elements || []);
}

export function createBackgroundFillStore(backgroundFill?: string) {
	return writable<string>(backgroundFill || 'none');
}
// Canvas state
export const isDrawing = writable<boolean>(false);

// Derived stores for computed values
export const canvasCursor = derived(
	currentTool,
	($currentTool) => {
		if ($currentTool === 'bucket') {
			return 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 16 16\'%3E%3Cpath fill=\'%23000\' d=\'M6.192 2.78c-.458-.677-.927-1.248-1.35-1.643a2.972 2.972 0 0 0-.71-.515C3.54.294 2.97.172 2.408.172c-.54 0-1.057.112-1.464.336-.413.227-.689.548-.689.92 0 .408.332.764.853 1.036.473.247 1.063.414 1.69.414.947 0 1.843-.287 2.394-.84zM1.5 5.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5 2 2 0 0 1-2 2h-1.291a1 1 0 0 0-.99.859L10.5 10.5a1.5 1.5 0 0 1-3 0L6.791 7.859A1 1 0 0 0 5.8 7H4.5a2 2 0 0 1-2-2z\' /%3E%3C/svg%3E") 8 8, auto';
		}
		return 'crosshair';
	}
);

export function vectorDataStore(
	shapes: Writable<VectorElement[]>,
	backgroundFill: Writable<string>
) {
	return derived(
		[shapes, backgroundFill],
		([$shapes, $backgroundFill]): VectorData => ({
			width: 800,
			height: 600,
			backgroundFill: $backgroundFill,
			elements: $shapes,
			timestamp: new Date().toISOString(),
			version: '2.0'
		})
	);
}

export function drawingStats(
	shapes: Writable<VectorElement[]>,
	backgroundFill: Writable<string>
) {
	const vectorData = vectorDataStore(shapes, backgroundFill);
	return derived(
		vectorData,
		($vectorData): DrawingStats => {
			const vectorStr = JSON.stringify($vectorData);
			const vectorSizeBytes = new Blob([vectorStr]).size;
			const bitmapSizeBytes = 800 * 600 * 4; // RGBA
			const spaceSavedPercent = vectorSizeBytes > 0
				? ((bitmapSizeBytes - vectorSizeBytes) / bitmapSizeBytes * 100).toFixed(1)
				: '100';

			return {
				vectorSize: formatBytes(vectorSizeBytes),
				bitmapSize: formatBytes(bitmapSizeBytes),
				spaceSaved: spaceSavedPercent + '%'
			};
		}
	);
}

// Utility function
function formatBytes(bytes: number): string {
	if (bytes === 0) return '0 bytes';
	const k = 1024;
	const sizes = ['bytes', 'KB', 'MB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}