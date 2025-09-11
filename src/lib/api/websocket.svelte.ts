import type { Action, VectorData, VectorElement } from '$lib/components/CanvasTypes';
import { get, writable } from 'svelte/store';

export interface WorkBoardState {
	id: string;
	vectorData: VectorData;
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
	lastSeen: { canvasId: string; position: { x: number; y: number } };
}

export interface WebSocketMessage {
	type: string;
	subtype?: string;
	data: any;
	userId?: string;
	projectId?: string;
}

export const connectionStatus = writable<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
export const operations = writable<WorkBoardState[]>([]);
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
				connectionStatus.set('connected');
				resolve();
			};

			this.ws.onmessage = (event) => {
				this.handleMessage(event);
			};

			this.ws.onclose = () => {
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
					switch (message.subtype) {
						case 'shape':
							operations.update((current) => {
								current.map(op => {
									if (op && op.id === message.data.id) {
										for (let i = 0; i < op.vectorData.elements.length; i++) {
											if (op.vectorData.elements[i] === null || 
												op.vectorData.elements[i].id === message.data.stroke.id) {

												op.vectorData.elements[i] = message.data.stroke;
											}
										}
										op.vectorData.elements.push(message.data.stroke);
									}
								});
								return current;
							});
							break;
						case 'canvas':
							operations.update((current) => {
								const op = message.data.id;
								const index = current.findIndex((c) => c.id === op);
								if (index !== -1) {
									current[index].vectorData.backgroundFill = message.data.background;
								}
								return current;
							});
							break;
						case 'remove':
							operations.update((current) => {
								return current.filter((c) => c.id !== message.data);
							});
							break;
						case 'add':
							operations.update((current) => {
								current.push(message.data[0]);
								return current;
							});
							break;
						case 'action':
							operations.update((current) => {
								current.map((wb) => {
									if (wb.id == message.data.canvasId) {
										for (let i = 0; i < wb.vectorData.elements.length; i++) {
											if (wb.vectorData.elements[i].id == message.data.vectorElementId) {
												wb.vectorData.elements[i].action = message.data.action;
											}
										}
									}
								});
								return current;
							});
							break;
						default:
							operations.set(message.data as WorkBoardState[]);
							break;
					}
					break;
				case 'users_state':
					users.set(message.data);
					break;
				case 'cursor_move':
					users.update((current) => {
						const user = current[message.data.userId];
						if (user) {
							user.lastSeen = { 
								canvasId: message.data.canvasId, 
								position: { 
									x: message.data.position.x, 
									y: message.data.position.y 
								} 
							};
							current[message.data.userId] = user;
						}
						return current;
					});
					break;
			}
		} catch (error) {
			console.error('Failed to parse WebSocket message:', error);
		}
	}

	sendOperation(operation: WorkBoardState[], subtype: string): void {
		this.sendMessage({
			type: 'operation',
			subtype: subtype,
			data: operation
		});
	}

	sendAction(canvasId: string, vectorElementId: string, action: Action): void {
		this.sendMessage({
			type: 'operation',
			subtype: 'action',
			data: {
				action: action,
				canvasId: canvasId,
				vectorElementId: vectorElementId
			}
		});
	}

	sendCursor(canvasId: string, point: Point): void {
		this.sendMessage({
			type: 'cursor_move',
			data: { 
				userId: this.userId, 
				canvasId: canvasId,
				position: point
			}
		});
	}

	sendRemoveCanvas(canvasID: string, subtype: string): void {
		this.sendMessage({
			type: 'operation',
			subtype: subtype,
			data: canvasID
		});
	}

	sendBackground(canvasID: string, backgroundFill: string, subtype: string): void {
		this.sendMessage({
			type: 'operation',
			subtype: subtype,
			data: {
				id: canvasID,
				background: backgroundFill
			}
		});
	}


	sendStroke(canvasID: string, stroke: VectorElement, subtype: string): void {
		this.sendMessage({
			type: 'operation',
			subtype: subtype,
			data: {
				id: canvasID,
				stroke: stroke
			}
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
