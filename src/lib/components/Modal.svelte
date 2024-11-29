<script lang="ts">
    import LoginModal from './LoginModal.svelte';
	import RegisterModal from './RegisterModal.svelte';

    export let showModal: boolean;

	let activeTab = 'register';
</script>

{#if activeTab === 'login'}
<LoginModal bind:showModal/>
{:else}
<RegisterModal bind:showModal/>
{/if}