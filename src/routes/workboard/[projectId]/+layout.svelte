<script lang="ts">
	import './canvas.css';
</script>

<main>
	<slot />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background-color: #f5f5f5;
	}
</style>
