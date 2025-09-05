<script lang="ts">
    import { get } from 'svelte/store';
    import {
        currentTool,
        currentStrokeColor,
        currentFillColor,
        currentStrokeWidth,
        shapes,
        backgroundFill,
        isDrawing,
        canvasCursor,
        vectorData,
        drawingStats

    } from '$lib/components/CanvasStore';
    import type {
        Point,
        VectorElement,
        VectorPath,
        VectorRectangle,
        VectorCircle,
        DrawingTool,
        Tool,
        CanvasState
    } from '$lib/components/CanvasTypes';
    import {
        generateId,
        getCanvasCoordinates,
        findShapeAtPoint,
        vectorToSVG,
        parseSVGPath,
        saveToLocalStorage,
        loadFromLocalStorage,
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

    // Tools configuration
    const tools: Tool[] = [
        { id: 'pen' as DrawingTool, name: 'Free Draw', icon: '✏️' },
        { id: 'rectangle' as DrawingTool, name: 'Rectangle', icon: '⬜' },
        { id: 'circle' as DrawingTool, name: 'Circle', icon: '⭕' },
        { id: 'bucket' as DrawingTool, name: 'Bucket Fill', icon: '🪣' }
    ];

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
    const vectorOutput = $derived(generateVectorOutput($vectorData));

    import { onMount, onDestroy } from 'svelte';
    import { ProjectWebSocket } from '$lib/api/websocket.svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    let projectId = data.projectId;
    let userId = data.userId;

    let socket: ProjectWebSocket;

    onMount(async () => {
        ctx = canvas.getContext('2d')!;
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
    });

    onDestroy(() => {
        socket?.disconnect();
        console.log('Disconnected from project:', projectId);
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

    // Save and load functionality
    function saveVector(): void {
        try {
            const data = get(vectorData);
            const stringData = JSON.stringify(data);
            saveToLocalStorage(STORAGE_KEY, data);
            downloadAsJSON(data, `svelte_ts_drawing_${Date.now()}.json`);
            alert('Drawing saved as TypeScript vector data!');
        } catch (error) {
            alert('Failed to save drawing: ' + (error as Error).message);
        }
    }

    function loadVector(): void {
        try {
            const saved = loadFromLocalStorage(STORAGE_KEY);
            if (saved) {
                loadVectorData(saved);
            } else {
                alert('No saved drawing found. Draw something and save it first!');
            }
        } catch (error) {
            alert('Failed to load drawing: ' + (error as Error).message);
        }
    }

    function loadVectorData(data: any): void {
        shapes.set(data.elements || []);
        backgroundFill.set(data.backgroundFill || 'none');
        redrawCanvas();
        alert('TypeScript vector drawing loaded!');
    }

    function loadFromStorage(): void {
        const saved = loadFromLocalStorage(STORAGE_KEY);
        if (saved) {
            loadVectorData(saved);
        }
    }

    function clearCanvas(): void {
        shapes.set([]);
        backgroundFill.set('none');
        canvasState = {
            isDrawing: false,
            currentPath: [],
            tempShapeStart: null
        };
        if (ctx) {
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
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

<svelte:head>
    <title>Svelte + TypeScript Vector Drawing App</title>
</svelte:head>

<div class="app-container">
    <header class="app-header">
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
        </div>

        <!-- Right Panel: Vector Data & Stats -->
        <div class="panel data-panel">
            <div class="panel-content">
                <h3>Utils ⚡</h3>
                <h4>Add Page:</h4>
                <div class="form-group action-buttons">
                    <button class="btn btn-primary" type="button">
                        ➕ New Page
                    </button>
                </div>
                <h4>Add Behavior:</h4>
                <!-- Action Buttons -->
                <div class="form-group action-buttons">
                    <button class="btn btn-primary" onclick={saveVector} type="button">
                        💾 Save as Vector
                    </button>
                    <button class="btn btn-secondary" onclick={loadVector} type="button">
                        📁 Load Vector
                    </button>
                    <button class="btn btn-danger" onclick={clearCanvas} type="button">
                        🗑️ Clear Canvas
                    </button>
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
    }

    .app-header h1 {
        color: #333;
        margin: 0 0 10px 0;
        font-size: 2.2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .app-content {
        display: grid;
        grid-template-columns: 0.3fr 1fr 0.3fr;
        gap: 15px;
        min-height: 100%;
        max-width: 100%;
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
        color: white;;
        border-color: #007bff;
    }

    .btn-primary:hover {
        background: linear-gradient(135deg, #0056b3, #004085);
        border-color: #0056b3;
    }

    .btn-secondary {
        background: linear-gradient(135deg, #6c757d, #545b62);
        color: white;
        border-color: #6c757d;
    }

    .btn-secondary:hover {
        background: linear-gradient(135deg, #545b62, #494f54);
        border-color: #545b62;
    }

    .btn-danger {
        background: linear-gradient(135deg, #dc3545, #c82333);
        color: white;
        border-color: #dc3545;
    }

    .btn-danger:hover {
        background: linear-gradient(135deg, #c82333, #a71e2a);
        border-color: #c82333;
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

    .data-panel h4 {
        margin: 0 0 12px 0;
        color: #333;
        font-size: 1.1rem;
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

        canvas {
            width: 100%;
            max-width: 400px;
            height: auto;
        }

        .app-header h1 {
            font-size: 1.8rem;
        }
    }
</style>