<script lang="ts">
	import ProjectCard from "$lib/components/ProjectCard.svelte";
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    let user = $state("Nick");
</script>

<h1>Hello {user}</h1>

<div class="project-container">
{#each data.projects as item}
     <ProjectCard></ProjectCard>
{/each}
</div>

<style>
    .project-container {
        display: flex;
    }
</style>