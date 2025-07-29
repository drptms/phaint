<script lang="ts">
    import ProjectCard from "$lib/components/ProjectCard.svelte";
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    let user = $state(data.userToken);

    function addProject() {
        alert("Add Project Clicked!");
    }
</script>

<div class="dashboard-header">
    <h1 class="dashboard-greeting">Hello {user}</h1>
    <button class="add-project-btn" onclick={addProject}>
        <svg width="20" height="20" fill="none" style="margin-right:8px;">
            <circle cx="10" cy="10" r="9" stroke="#ffffff" stroke-width="2"/>
            <path d="M10 6v8M6 10h8" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Add Project
    </button>
</div>

<div class="project-container">
    {#each data.projects as item}
        <ProjectCard {item}/>
    {/each}
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    .dashboard-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 2rem;
        padding-top: 1rem;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
    }

    .dashboard-greeting {
        color: black;
        font-size: 2.2rem;
        font-weight: 700;
        text-shadow: 0 2px 10px rgba(0,0,0,0.25);
        letter-spacing: -1px;
        margin: 0;
    }

    .add-project-btn {
        display: flex;
        align-items: center;
        background: linear-gradient(135deg, #8a2be2 0%, #9932cc 100%);
        color: white;
        border: none;
        border-radius: 12px;
        padding: 0.8rem 1.5rem;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 8px 20px rgba(138,43,226,0.21);
        transition: all .2s cubic-bezier(.4,0,.2,1);
        outline: none;
        gap: 0.5rem;
    }
    .add-project-btn:hover {
        background: linear-gradient(135deg, #9932cc 0%, #8a2be2 100%);
        transform: translateY(-2px) scale(1.03);
        box-shadow: 0 16px 40px rgba(138,43,226,0.22);
    }

    .project-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 2rem;
        padding: 0 0.5rem 2rem 0.5rem;
        margin-top: 0;
    }

    @media (max-width: 600px) {
        .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.5rem;
            padding-left: 0.1rem;
            padding-right: 0.1rem;
        }
        .dashboard-greeting {
            font-size: 1.3rem;
        }
        .project-container {
            gap: 1rem;
        }
        .add-project-btn {
            padding: 0.7rem 1rem;
            font-size: 0.95rem;
        }
    }
</style>
