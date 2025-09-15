<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import { showLayout } from '$lib/stores/ui';

	let { data, children } = $props();
</script>
{#if ($showLayout)}
	<Navbar {data}></Navbar>
{/if}
{@render children()}