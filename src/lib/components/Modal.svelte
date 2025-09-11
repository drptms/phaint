<script lang="ts">
	import LoginModal from './LoginModal.svelte';
	import RegisterModal from './RegisterModal.svelte';
	import LogoutModal from '$lib/components/LogoutModal.svelte';

	let { activeTab = $bindable(), showModal = $bindable(), userId = $bindable() } = $props();

	function switchModal() {
		if (activeTab === 'login') {
			activeTab = 'register';
		} else {
			activeTab = 'login';
		}
	}
</script>

<!--{#if userId.length === 0}-->

{#if userId}
	<LogoutModal
		bind:showModal={showModal}
		switchModal={switchModal}
	/>
{:else}
	{#if activeTab === 'login'}
		<LoginModal
			bind:showModal={showModal}
			switchModal={switchModal}
		/>
	{:else }
		<RegisterModal
			bind:showModal={showModal}
			switchModal={switchModal}
		/>
	{/if}
{/if}