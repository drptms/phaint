<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte";

    let { children } = $props();
</script>

<Navbar></Navbar>

{@render children()}