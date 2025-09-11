<script lang="ts">
	import './canvas.css';
	import { showLayout } from '$lib/stores/ui';

	$showLayout = false;
</script>

<main>
	<slot />
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }
</style>
