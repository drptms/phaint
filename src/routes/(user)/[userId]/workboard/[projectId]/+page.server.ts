// import { onMount, onDestroy } from 'svelte';
// import { ProjectWebSocket, connectionStatus, operations, users } from '$lib/api/websocket.svelte';
// import type { PageServerLoad } from './$types';
// import { onDestroy } from 'svelte';
//
// let projectId: string;
// let userId: string;
// let socket: ProjectWebSocket;
//
// // @ts-ignore
// export const load: PageServerLoad = async ({ cookies, params }) => {
// 	projectId = params.projectId;
// 	userId = cookies.get('UserToken')!;
// 	socket = new ProjectWebSocket(projectId, userId);
//
// 	try {
// 		await socket.connect();
// 		console.log('Conneted to project: ', projectId);
// 	} catch (error) {
// 		console.log('Failed to connect: ', error);
// 	}
//
// 	return { projectId, socket };
// };

// onMount(async () => {
// 	// Initialize WebSocket connection
// 	socket = new ProjectWebSocket(projectId);
//
// 	try {
// 		await socket.connect();
// 		console.log('Connected to project:', projectId);
// 	} catch (error) {
// 		console.error('Failed to connect:', error);
// 	}
// });
//

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const projectId = params.projectId;
	const userId = cookies.get('UserToken') || null;

	// Return data needed by the client component
	return { projectId, userId };
};