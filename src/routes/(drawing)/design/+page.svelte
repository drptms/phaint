<script>

    import Canvas from "$lib/components/Canvas.svelte";
	import { selected, brush } from './shared.svelte';

	// in future it will be props(the number of pages needs to be loaded in the db)
	let pages = $state(1)
</script>

<div class="container">
	{#each {length: pages} as _}
    	<Canvas color={selected.color} size={brush.size} bind:pages={pages} />
	{/each}
</div>

<style>
	.container {
		position: relative;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}
</style>
