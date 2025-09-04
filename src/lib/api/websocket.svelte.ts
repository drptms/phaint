import { writable } from 'svelte/store';

export interface DrawingOperation {
	type: string;
	tool: string;
	color: string;
	points: Point[];
	timestamp: number;
	userId: string;
	id: string;
	projectId: string;
}

export interface Point {
	x: number;
	y: number;
}

export interface UserPresence {
	userId: string;
	cursor?: Point;
	color: string;
	isDrawing: boolean;
	lastSeen: string;
}

export interface WebSocketMessage {
	type: string;
	data: any;
	userId?: string;
	projectId?: string;
}

export const connectionStatus = writable<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
export const operations = writable<DrawingOperation[]>([]);
export const users = writable<Record<string, UserPresence>>({});

export class ProjectWebSocket {
	private ws: WebSocket | null = null;
	private readonly projectId: string;
	private readonly userId: string;

	constructor(projectId: string, userId: string) {
		this.projectId = projectId;
		this.userId = userId;
	}

	connect(): Promise<void> {
		return new Promise((resolve, reject) => {
			connectionStatus.set('connecting');

			const wsUrl = `ws://localhost:8080/connect?projectId=${encodeURIComponent(this.projectId)}&userId=${encodeURIComponent(this.userId)}`;
			this.ws = new WebSocket(wsUrl);

			this.ws.onopen = () => {
				console.log(`WebSocket connected to project ${this.projectId}`);
				connectionStatus.set('connected');
				resolve();
			};

			this.ws.onmessage = (event) => {
				this.handleMessage(event);
			};

			this.ws.onclose = () => {
				console.log('WebSocket disconnected');
				connectionStatus.set('disconnected');
			};

			this.ws.onerror = (error) => {
				console.error('WebSocket error:', error);
				connectionStatus.set('error');
				reject(error);
			};
		});
	}

	private handleMessage(event: MessageEvent): void {
		try {
			const message: WebSocketMessage = JSON.parse(event.data);

			switch (message.type) {
				case 'operation':
					operations.update(ops => [...ops, message.data as DrawingOperation]);
					break;
				case 'users_state':
					users.set(message.data);
					break;
				case 'cursor_move':
					// Update user cursor position
					break;
			}
		} catch (error) {
			console.error('Failed to parse WebSocket message:', error);
		}
	}

	sendOperation(operation: DrawingOperation): void {
		this.sendMessage({
			type: 'operation',
			data: operation
		});
	}

	sendCursorPosition(x: number, y: number): void {
		this.sendMessage({
			type: 'cursor_move',
			data: { position: { x, y } }
		});
	}

	private sendMessage(message: WebSocketMessage): void {
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
			this.ws.send(JSON.stringify(message));
		}
	}

	disconnect(): void {
		if (this.ws) {
			this.ws.close();
		}
	}

	isConnected(): boolean {
		return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
	}
}
