<script lang="ts">
    import LoginModal from './LoginModal.svelte';

    export let showModal: boolean;

	let activeTab = 'login';
</script>

{#if activeTab === 'login'}
<LoginModal bind:showModal/>
{:else}
	<!-- TODO -->
{/if}