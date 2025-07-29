<script lang="ts">
    import LoginModal from './LoginModal.svelte';
	import RegisterModal from './RegisterModal.svelte';
    
    let {activeTab = $bindable(), showModal = $bindable()} = $props();
    
    function switchModal() {
        if (activeTab === 'login') {
            activeTab = 'register'
        } else {
            activeTab = 'login'
        }
    }
</script>

{#if activeTab === 'login'}
<LoginModal 
    bind:showModal={showModal}
    switchModal={switchModal}
/>
{:else}
<RegisterModal 
    bind:showModal={showModal}
    switchModal={switchModal}
/>
{/if}