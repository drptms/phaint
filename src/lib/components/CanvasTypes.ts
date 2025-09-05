import type { Writable } from "svelte/store";
import type Canvas from "./Canvas.svelte";

export interface Point {
	x: number;
	y: number;
}

export interface CanvasType {
	id: string;
	index: number;
	shapes: Writable<VectorElement[]>;
	backgroundFill: Writable<string>;
}

export interface VectorShape {
	id: string;
	stroke: string;
	strokeWidth: number;
	fill: string;
}

export interface VectorPath extends VectorShape {
	type: 'path';
	points: Point[];
}

export interface VectorRectangle extends VectorShape {
	type: 'rectangle';
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface VectorCircle extends VectorShape {
	type: 'circle';
	cx: number;
	cy: number;
	radius: number;
}

export type VectorElement = VectorPath | VectorRectangle | VectorCircle;

export interface VectorData {
	width: number;
	height: number;
	backgroundFill: string;
	elements: VectorElement[];
	timestamp: string;
	version: string;
}

export enum DrawingTool {
	PEN = 'pen',
	RECTANGLE = 'rectangle',
	CIRCLE = 'circle',
	BUCKET = 'bucket'
}

export interface Tool {
	id: DrawingTool;
	name: string;
	icon: string;
	cursor?: string;
}

export interface SVGElement {
	type: 'path' | 'rect' | 'circle';
	d?: string;
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	cx?: number;
	cy?: number;
	r?: number;
	stroke: string;
	strokeWidth: number;
	fill: string;
}

export interface CanvasState {
	isDrawing: boolean;
	currentPath: Point[];
	tempShapeStart: Point | null;
}

export interface DrawingStats {
	vectorSize: string;
	bitmapSize: string;
	spaceSaved: string;
}

export interface MouseEventWithCoords extends MouseEvent {
	canvasX?: number;
	canvasY?: number;
}