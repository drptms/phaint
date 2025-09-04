<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { ProjectWebSocket } from '$lib/api/websocket.svelte';
	import type { PageData } from './$types';

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
	});

	onDestroy(() => {
		socket?.disconnect();
		console.log('Disconnected from project:', projectId);
	});
</script>

<h1>Hello! we are working on {projectId}</h1>