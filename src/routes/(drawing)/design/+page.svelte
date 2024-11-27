<script>

    import Canvas from "./Canvas.svelte";
	import { selected, brush } from './shared.svelte';

</script>

<div class="container">
    <Canvas color={selected.color} size={brush.size} />
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
