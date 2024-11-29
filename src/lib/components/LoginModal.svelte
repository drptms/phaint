<script>
	let { showModal = $bindable() } = $props();

	let dialog = $state(); // HTMLDialogElement

	$effect(() => {
		if (showModal) dialog.showModal();
	});
</script>

<!-- The Login Dialog -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog bind:this={dialog}
	onclose={() => (showModal = false)}
	onclick={(e) => { if (e.target === dialog) dialog.close(); }}
	 id="loginDialog">
	<div class="login-modal">
		<h3>Login</h3>
		<form id="loginForm" method="POST" action="/login?/login">
			<input type="text" id="username" name="username" placeholder="Username" required />
			<input type="password" id="password" name="password" placeholder="Password" required />

			<div class="dialog-actions">
				<button type="submit" class="primary">Login</button>
				<button type="button" class="secondary" id="cancelBtn">Cancel</button>
			</div>
		</form>
		<!-- svelte-ignore a11y_autofocus -->
		<button autofocus onclick={() => dialog.close()}>close modal</button>
	</div>
</dialog>

<style>
	/* Basic styling for the dialog */
	dialog {
		width: 350px;
		padding: 20px;
		border: none;
		border-radius: 8px;
		box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.4);
	}

	/* Styling for the modal form */
	.login-modal {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	input {
		width: 100%;
		padding: 10px;
		border: 1px solid #ddd;
		border-radius: 5px;
	}

	.dialog-actions {
		display: flex;
		justify-content: flex-end;
		gap: 10px;
	}

	button {
		padding: 10px 15px;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	button.primary {
		background-color: #007bff;
		color: white;
	}

	button.secondary {
		background-color: #ddd;
		color: black;
	}
</style>
