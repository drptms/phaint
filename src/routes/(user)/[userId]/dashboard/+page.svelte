<script lang="ts">
	import InvitationModal from '$lib/components/InvitationModal.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import ProjectModal from '$lib/components/ProjectModal.svelte';
	import type { PageData } from './$types';
	import { darkMode } from '$lib/stores/theme';

	let { data }: { data: PageData } = $props();
	let user = data.username;

	let showModal = $state(false);
	let showInvitationModal = $state(false);

	function openModal() {
		showModal = true;
	}
	function closeModal() {
		showModal = false;
	}

    function openInvitationModal() {
		showInvitationModal = true;
	}
	function closeInvitationModal() {
		showInvitationModal = false;
	}
</script>

<div class="dashboard-header" class:dark={$darkMode}>
	<h1 class="dashboard-greeting" class:dark={$darkMode}>Hello {user}</h1>
    <div class="button-group" class:dark={$darkMode}>
        <button class="add-project-btn" class:dark={$darkMode} onclick={openInvitationModal}>
            <!-- svg unchanged -->
            Accept Invitation
        </button>
        <button class="add-project-btn" class:dark={$darkMode} onclick={openModal}>
            <!-- svg unchanged -->
            Add Project
        </button>
    </div>
</div>  

<ProjectModal
	open={showModal}
	onClose={closeModal}
/>

<InvitationModal
	open={showInvitationModal}
	onClose={closeInvitationModal}
/>

<div class="project-container" class:dark={$darkMode}>
    <h2 class:dark={$darkMode}>Your Projects</h2>
    <div class="own-projects" class:dark={$darkMode}>
        {#each data.own as item}
            <ProjectCard {item} />
        {/each}
    </div>
    <h2 class:dark={$darkMode}>Shared Projects</h2>
    <div class="shared-projects" class:dark={$darkMode}>
        {#each data.shared as item}
            <ProjectCard {item} />
        {/each}
    </div>
</div>

<style>
    :root {
        --text-color-light: #222;
        --heading-color-light: #111;
        --text-color-dark: #eee;
        --heading-color-dark: #f0e7db;
    }

    .dashboard-header {
        color: var(--text-color-light);
        transition: color 0.5s ease;
    }

    .dashboard-header.dark {
        color: var(--text-color-dark);
    }

    .dashboard-greeting {
        color: var(--heading-color-light);
        font-weight: 700;
        font-size: 2.2rem;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
        margin: 0;
        transition: color 0.5s ease;
    }

    .dashboard-header.dark .dashboard-greeting {
        color: var(--heading-color-dark);
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    }

    .project-container h2 {
        color: var(--heading-color-light);
        transition: color 0.5s ease;
    }

    .project-container.dark h2 {
        color: var(--heading-color-dark);
    }

    .dashboard-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 2rem;
        padding: 1rem 0.5rem;
        color: inherit; /* inherit for theme support */
    }

    .dashboard-greeting {
        font-size: 2.2rem;
        font-weight: 700;
        letter-spacing: -1px;
        margin: 0;
        text-shadow: 0 2px 10px rgba(0 0 0 / 0.15);
    }

    :global(body).dark .dashboard-greeting {
        text-shadow: 0 2px 8px rgba(0 0 0 / 0.5);
    }

    .button-group {
        display: flex;
        gap: 1rem;
    }

    .add-project-btn {
        display: flex;
        align-items: center;
        background: linear-gradient(135deg, #a3cef1 0%, #ffcbcb 100%);
        color: #1a1a1a;
        border: none;
        border-radius: 12px;
        padding: 0.8rem 1.5rem;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 8px 20px rgba(163, 206, 241, 0.35);
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        gap: 0.5rem;
    }

    .add-project-btn:hover,
    .add-project-btn:focus {
        background: linear-gradient(135deg, #ffcbcb 0%, #a3cef1 100%);
        transform: translateY(-2px) scale(1.03);
        box-shadow: 0 16px 40px rgba(255, 203, 203, 0.4);
    }

    :global(body).dark .add-project-btn {
        background: linear-gradient(135deg, #335c67 0%, #e09f3e 100%);
        color: #f0e7db;
        box-shadow: 0 8px 20px rgba(51, 92, 103, 0.7);
    }

    :global(body).dark .add-project-btn:hover,
    :global(body).dark .add-project-btn:focus {
        background: linear-gradient(135deg, #e09f3e 0%, #335c67 100%);
        box-shadow: 0 16px 40px rgba(224, 159, 62, 0.7);
    }

    .project-container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        padding: 0 0.5rem 2rem;
        max-width: 1300px;
        margin: 0 auto;
        color: inherit; /* inherit for theme text */
    }

    .project-container h2 {
        margin-bottom: 1rem;
        letter-spacing: -0.01em;
    }

    /* More projects in a row, responsive grid with auto-fit & minmax */
    .own-projects,
    .shared-projects {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 2rem;
        justify-content: start;
    }

    .shared-projects {
        border-top: 2px solid rgba(0, 0, 0, 0.1);
        padding-top: 2rem;
    }

    :global(body).dark .shared-projects {
        border-top-color: rgba(255, 255, 255, 0.15);
    }

    /* Responsive adjustments */
    @media (max-width: 600px) {
        .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.5rem;
            padding: 1rem 0.1rem;
        }

        .dashboard-greeting {
            font-size: 1.3rem;
        }

        .project-container {
            gap: 1rem;
        }

        .add-project-btn {
            padding: 0.6rem 1rem;
            font-size: 0.95rem;
        }
    }
</style>
