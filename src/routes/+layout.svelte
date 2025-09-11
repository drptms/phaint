<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import { showLayout } from '$lib/stores/ui';
	import { darkMode } from '$lib/stores/theme';

	let { data, children } = $props();
</script>
{#if ($showLayout)}
	<Navbar {data}></Navbar>
{/if}
<div class="background" class:dark={$darkMode}></div>

<main class="content">
	{@render children()}
</main>

<style>
    :global(html, body) {
        overflow-y: scroll; /* allow scrolling */
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE and Edge */
    }

    :global(body::-webkit-scrollbar) {
        width: 0;  /* Chrome, Safari, Opera: hide scrollbar by setting zero width */
        background: transparent;
    }

    /* The fixed full-screen background with soft gradients */
    .background {
        position: fixed;
        inset: 0;
        z-index: -1; /* behind all content */
        background: linear-gradient(135deg, #f2f7ff, #d9e7ff);
        transition: background 0.5s ease;
    }

    .background.dark {
        background: linear-gradient(135deg, #1a1a2e, #16213e);
    }

    /* Main content container to handle padding and scrolling */
    .content {
        position: relative;
        min-height: 100vh;
        padding: 1rem 2rem;
        transition: color 0.5s ease;
        color: #222;
    }

    .dark .content {
        color: #eee;
    }
</style>