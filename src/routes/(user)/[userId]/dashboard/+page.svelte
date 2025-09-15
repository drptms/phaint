<script lang="ts">
	import InvitationModal from '$lib/components/InvitationModal.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import ProjectModal from '$lib/components/ProjectModal.svelte';
	import type { PageData } from './$types';

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

<div class="dashboard-header">
	<h1 class="dashboard-greeting">Hello {user}</h1>
    <div class="button-group">
        <button class="add-project-btn" onclick={openInvitationModal}>
            <!-- svg unchanged -->
            Accept Invitation
        </button>
        <button class="add-project-btn" onclick={openModal}>
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

<div class="project-container">
    <h2>Your Projects</h2>
    <div class="own-projects">
        
        {#each data.own as item}
            <ProjectCard {item} />
        {/each}
    </div>
    <h2>Shared Projects</h2>
    <div class="shared-projects">
        
        {#each data.shared as item}
            <ProjectCard {item} />
        {/each}
    </div>
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
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
        letter-spacing: -1px;
        margin: 0;
    }

    .button-group {
        display: flex;
        gap: 1rem;
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
        box-shadow: 0 8px 20px rgba(138, 43, 226, 0.21);
        transition: all .2s cubic-bezier(.4, 0, .2, 1);
        outline: none;
        gap: 0.5rem;
    }

    .add-project-btn:hover {
        background: linear-gradient(135deg, #9932cc 0%, #8a2be2 100%);
        transform: translateY(-2px) scale(1.03);
        box-shadow: 0 16px 40px rgba(138, 43, 226, 0.22);
    }

    .project-container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        padding: 0 0.5rem 2rem 0.5rem;
        max-width: 1100px; /* Optional for better max width */
        margin: 0 auto;
    }

    .own-projects, .shared-projects {
        display: grid;
        grid-template-columns: repeat(4, 260px);
        gap: 2rem;
        justify-content: center;
    }

    .shared-projects {
        border-top: 2px solid #e0e0e0; /* Horizontal dividing line */
        padding-top: 2rem;
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
