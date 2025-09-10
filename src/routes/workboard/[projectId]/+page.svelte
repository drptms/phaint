<script lang="ts">
	import Canvas from '$lib/components/Canvas.svelte';
	import {
		currentTool,
		currentStrokeColor,
		currentFillColor,
		currentStrokeWidth,
		createShapesStore,
		createBackgroundFillStore,
		vectorDataStore
	} from '$lib/components/CanvasStore';
	import type { DrawingTool, Tool, CanvasType, VectorElement } from '$lib/components/CanvasTypes';
	import { generateId } from '$lib/components/CanvasUtils';
	import { showLayout } from '$lib/stores/ui';

	// Tools configuration
	const tools: Tool[] = [
		{ id: 'pen' as DrawingTool, name: 'Free Draw', icon: '✏️' },
		{ id: 'rectangle' as DrawingTool, name: 'Rectangle', icon: '⬜' },
		{ id: 'circle' as DrawingTool, name: 'Circle', icon: '⭕' },
		{ id: 'bucket' as DrawingTool, name: 'Bucket Fill', icon: '🪣' }
	];

	let canvases: CanvasType[] = $state([]);

	// Colors configuration
	const colors: string[] = [
		'#000000',
		'#FF0000',
		'#00FF00',
		'#0000FF',
		'#FFFF00',
		'#FF00FF',
		'#00FFFF',
		'#FFFFFF',
		'#808080',
		'#800000',
		'#008000',
		'#000080'
	];

	// Reactive statements for vector output display
	//const vectorOutput = $derived(generateVectorOutput($vectorData));

	import { onMount, onDestroy } from 'svelte';
	import {
		operations,
		ProjectWebSocket,
		users,
		type WorkBoardState
	} from '$lib/api/websocket.svelte';
	import type { PageData } from './$types';
	import { get, writable } from 'svelte/store';

	let { data }: { data: PageData } = $props();
	let projectId = data.projectId;
	let userId = data.userId;

	let socket: ProjectWebSocket;

	onMount(async () => {
		if (!projectId || !userId) {
			console.error('Missing projectId or userId');
			return;
		}
		socket = new ProjectWebSocket(projectId, userId);
		try {
			await socket.connect();
			console.log('Connected to project:', projectId);
		} catch (error) {
			console.error('Failed to connect:', error);
		}
		if ($operations.length > 0) {
			console.log('Loading initial operations:', $operations);
			loadFromVector($operations);
		}
	});

	onDestroy(() => {
		socket?.disconnect();
		$showLayout = true;
		console.log('Disconnected from project:', projectId);
	});

	$effect(() => {
		try {
			if ($operations.length > 0) {
				loadFromVector($operations);
			}
		} catch (e) {
			console.error('Error in operations subscription:', e);
		}
	});

	function addNewPage(): void {
		const shapes = createShapesStore();
		const backgroundFill = createBackgroundFillStore();

		const newCanvas: CanvasType = {
			id: generateId(),
			shapes,
			backgroundFill,
			timestamp: new Date().toISOString()
		};
		canvases = [...canvases, newCanvas];
		addCanvas({
			id: newCanvas.id,
			vectorData: get(vectorDataStore(shapes, backgroundFill, newCanvas.timestamp))
		} as WorkBoardState);
	}

	// Tool and color selection
	function selectTool(tool: DrawingTool): void {
		currentTool.set(tool);
	}

	function selectStrokeColor(color: string): void {
		currentStrokeColor.set(color);
	}

	function selectFillColor(color: string): void {
		currentFillColor.set(color);
	}

	function sendEntireWorkspace(): void {
		socket.sendOperation(
			canvases.map((c) => {
				const vectorData = vectorDataStore(c.shapes, c.backgroundFill, c.timestamp);
				return { id: c.id, vectorData: get(vectorData) };
			}) as WorkBoardState[],
			'load'
		);
	}

	function sendSingleVector(canvasId: string, stroke: VectorElement): void {
		socket.sendStroke(canvasId, stroke, 'shape');
	}

	function sendSingleCanvasBackground(canvasID: string, backgroundFill: string): void {
		socket.sendBackground(canvasID, backgroundFill, 'canvas');
	}

	function addCanvas(canvas: WorkBoardState): void {
		socket.sendOperation([canvas] as WorkBoardState[], 'add');
	}

	function removeCanvas(canvasID: string): void {
		canvases = canvases.filter((c) => c.id !== canvasID);
		socket.sendRemoveCanvas(canvasID, 'remove');
	}

	function sendCursor(canvasId: string, point: { x: number; y: number }): void {
		socket.sendCursor(canvasId, point);
	}

	export function loadFromVector(operation: WorkBoardState[]): void {
		canvases = operation
			.slice()
			.sort((a, b) => {
				// assuming timestamp is a string, parse to Date for comparison
				const t1: number = new Date(a.vectorData.timestamp).getTime();
				const t2: number = new Date(b.vectorData.timestamp).getTime();
				return t1 - t2;
			})
			.map((op) => ({
				id: op.id,
				shapes: createShapesStore(op.vectorData.elements),
				backgroundFill: createBackgroundFillStore(op.vectorData.backgroundFill),
				timestamp: op.vectorData.timestamp
			}));
	}
</script>

<svelte:head>
	<title>Svelte + TypeScript Vector Drawing App</title>
</svelte:head>

<div class="app-container">
	<header class="app-header">
		<button class="btn-nobg" onclick={() => history.go(-1)}>⬅️</button>
		<h1>🎨 Project Name</h1>
	</header>

	<div class="app-content">
		<!-- Left Panel: Drawing Tools -->
		<div class="panel tools-panel">
			<div class="panel-content">
				<h3>🛠️ Drawing Tools</h3>

				<!-- Tool Selection -->
				<div class="form-group">
					<h4 class="form-label">Tool:</h4>
					<div class="tool-buttons">
						{#each tools as tool}
							<button
								class="btn tool-btn"
								class:active={$currentTool === tool.id}
								class:bucket-tool={tool.id === 'bucket'}
								onclick={() => selectTool(tool.id)}
								type="button"
							>
								{tool.icon}
								{tool.name}
							</button>
						{/each}
					</div>
				</div>

				<!-- Stroke Color Selection -->
				<div class="form-group">
					<h4 class="form-label">Stroke Color:</h4>
					<div class="color-palette">
						{#each colors as color}
							<button
								class="color-swatch"
								class:active={$currentStrokeColor === color}
								style="background-color: {color};"
								onclick={() => selectStrokeColor(color)}
								type="button"
								aria-label="Stroke color {color}"
							></button>
						{/each}
					</div>
				</div>

				<!-- Fill Color Selection -->
				<div class="form-group">
					<h4 class="form-label">Fill Color:</h4>
					<div class="color-palette">
						{#each colors as color}
							<button
								class="color-swatch"
								class:active={$currentFillColor === color}
								style="background-color: {color};"
								onclick={() => selectFillColor(color)}
								type="button"
								aria-label="Fill color {color}"
							></button>
						{/each}
					</div>
				</div>

				<!-- Stroke Width -->
				<div class="form-group">
					<h4 class="form-label">Stroke Width: {$currentStrokeWidth}px</h4>
					<input
						type="range"
						min="1"
						max="20"
						bind:value={$currentStrokeWidth}
						class="stroke-slider"
					/>
				</div>
			</div>
		</div>

		<!-- Center Panel: Canvas -->
		<div class="panel canvas-panel">
			{#each canvases as c}
				<div class="canvas-container">
					<button class="btn-nobg" onclick={() => removeCanvas(c.id)}>❌</button>
					<Canvas
						shapes={c.shapes}
						backgroundFill={c.backgroundFill}
						timestamp={c.timestamp}
						canvasId={c.id}
						clientId={userId}
						sendStrokes={(stroke: VectorElement) => sendSingleVector(c.id, stroke)}
						sendCanvasMetadata={(color: string) => sendSingleCanvasBackground(c.id, color)}
						sendCursorPosition={(point: { x: number; y: number }) => sendCursor(c.id, point)}
					/>
				</div>
			{/each}
		</div>

		<!-- Right Panel: Vector Data & Stats -->
		<div class="panel data-panel">
			<div class="panel-content">
				<h3>Utils ⚡</h3>
				<h4>Add Page:</h4>
				<div class="form-group action-buttons">
					<button onclick={addNewPage} class="btn btn-primary" type="button"> ➕ New Page </button>
				</div>
				<h4>Add Behavior:</h4>
				<!-- Action Buttons -->
				<div class="form-group action-buttons">
					<button class="btn btn-primary" type="button" onclick={sendEntireWorkspace}>
						💾 Save as Vector
					</button>
				</div>
				<div class="user-list">
					{#each Object.values($users) as user}
						{#if user.userId !== userId}
							<div class="user-item" title={`User ID: ${user.userId}, Color: ${user.color}`}>
								<div
									class="user-color-indicator"
									style="background-color: {user.color}"
									aria-label={`Color for user ${user.userId}`}
								></div>
								<div class="user-text">
									<p class="user-id" title={user.userId}>{user.userId}</p>
									<p class="user-color" title={user.color}>{user.color}</p>
								</div>
							</div>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.app-container {
		margin: 0 auto;
		padding: 20px;
		max-height: 100%;
		overflow: hidden;
	}

	.app-header {
		text-align: center;
		margin-bottom: 30px;
		height: 5vh;
		position: relative;
		display: flex;
		align-items: center;
	}

	.app-header button {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		font-size: 1.5rem;
	}

	.app-header h1 {
		color: #333;
		margin: 0 0 10px 0;
		font-size: 2.2rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin: 0 auto;
	}

	.app-content {
		display: grid;
		grid-template-columns: 0.3fr 1fr 0.3fr;
		gap: 15px;
		min-height: 100%;
		max-width: 100%;
		min-width: 90vw;
		height: 80vh;
		overflow: auto;
	}

	.panel {
		background: white;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		border: 1px solid #e5e7eb;
	}

	.panel-content {
		padding: 16px;
		display: flex;
		flex-direction: column;
		overflow: auto;
		height: 100%;
	}

	.panel-content h3 {
		text-align: center;
		margin: 0 0 15px 0;
		font-size: 1.5rem;
		color: #222;
		border-bottom: 2px solid #eee;
		padding-bottom: 10px;
	}

	.canvas-container {
		margin-bottom: 10px;
		display: flex;
		flex-direction: row;
	}

	.tools-panel h3,
	.data-panel h3 {
		margin: 0 0 20px 0;
		color: #333;
		font-size: 1.3rem;
	}

	.form-group {
		margin-bottom: 20px;
	}

	.form-label {
		display: block;
		margin-bottom: 8px;
		color: #555;
	}

	.tool-buttons {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.btn {
		padding: 12px 16px;
		border: 2px solid #ddd;
		border-radius: 8px;
		cursor: pointer;
		font-size: 14px;
		font-weight: 500;
		transition: all 0.2s ease;
		background: white;
		color: #333;
		font-family: inherit;
	}

	.btn:hover {
		border-color: #007bff;
		background: #f8f9fa;
		transform: translateY(-1px);
	}

	.btn.active {
		background: linear-gradient(135deg, #007bff, #0056b3);
		color: white;
		border-color: #007bff;
		box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
	}

	.btn.bucket-tool.active {
		background: linear-gradient(135deg, #28a745, #20c997);
		border-color: #28a745;
		box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
	}

	.btn-primary {
		background: linear-gradient(135deg, #007bff, #0056b3);
		color: white;
		border-color: #007bff;
	}

	.btn-primary:hover {
		background: linear-gradient(135deg, #0056b3, #004085);
		border-color: #0056b3;
	}

	.btn-nobg {
		border: none;
		background: none;
		align-self: start;
	}
	.btn-nobg:hover {
		border: none;
		align-self: start;
		box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
		cursor: pointer;
	}

	.color-palette {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 8px;
	}

	.color-swatch {
		width: 100%;
		height: 30px;
		border: 3px solid #ddd;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		padding: 0;
		background: none;
	}

	.color-swatch:hover {
		border-color: #999;
		transform: scale(1.05);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	}

	.color-swatch.active {
		border-color: #007bff;
		border-width: 3px;
		box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
		transform: scale(1.1);
	}

	.stroke-slider {
		width: 100%;
		height: 8px;
		border-radius: 4px;
		background: #ddd;
		outline: none;
		cursor: pointer;
		appearance: none;
	}

	.stroke-slider::-webkit-slider-thumb {
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: linear-gradient(135deg, #007bff, #0056b3);
		cursor: pointer;
		box-shadow: 0 2px 8px rgba(0, 123, 255, 0.4);
	}

	.action-buttons {
		border-top: 1px solid #eee;
		padding-top: 20px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.canvas-panel {
		overflow: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20px;
		background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
	}
	.data-panel h4 {
		margin: 0 0 12px 0;
		color: #333;
		font-size: 1.1rem;
	}

	.user-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
		max-height: 150px;
		overflow-y: auto;
		padding-right: 6px; /* For scrollbar space */
	}

	.user-item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 6px 10px;
		border-radius: 8px;
		background-color: #fafafa;
		border: 1px solid #ddd;
		white-space: nowrap;
	}

	.user-color-indicator {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		border: 2px solid #ccc;
		flex-shrink: 0;
	}

	.user-text {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		min-width: 0; /* Important for text truncation in flex */
	}

	.user-id,
	.user-color {
		margin: 0;
		font-size: 14px;
		line-height: 1.2;
		color: #333;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.user-id {
		font-weight: 600;
	}

	.user-color {
		font-family: monospace;
		font-size: 13px;
		color: #666;
	}
	/* Responsive design */
	@media (max-width: 1200px) {
		.app-content {
			grid-template-columns: 280px 1fr 280px;
			gap: 15px;
		}
	}

	@media (max-width: 768px) {
		.app-content {
			grid-template-columns: 1fr;
			gap: 20px;
		}
		.app-header h1 {
			font-size: 1.8rem;
		}
	}
</style>
