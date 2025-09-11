<script>
	let { showModal = $bindable() } = $props();
	import { darkMode } from '$lib/stores/theme';

	let dialog = $state(); // HTMLDialogElement

	$effect(() => {
		if (showModal) dialog.showModal();
	});
</script>

<!-- The Login Dialog -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog id="loginDialog" class:dark={$darkMode}
				bind:this={dialog}
				onclose={() => (showModal = false)}
				onclick={(e) => { if (e.target === dialog) dialog.close(); }}>
	<div class="login-modal" class:dark={$darkMode}>
		<h1 class:dark={$darkMode}>Logout</h1>
		<p class="subtitle" class:dark={$darkMode}>See you!</p>
		<form id="loginForm" class:dark={$darkMode} method="POST" action="/logout?/logout">
			<button type="submit" class="login-btn" class:dark={$darkMode}>Logout</button>
		</form>
	</div>
</dialog>

<style>
    :root {
        --bg-light: linear-gradient(135deg, #e7e9fc, #cddbff);
        --bg-dark: linear-gradient(135deg, #2b193b, #473275);

        --text-light: #222;
        --text-dark: #eee;

        --btn-bg-light: linear-gradient(135deg, #a3cef1, #ffcbcb);
        --btn-bg-dark: linear-gradient(135deg, #335c67, #e09f3e);

        --btn-hover-bg-light: linear-gradient(135deg, #c0dbfb, #ffc0c0);
        --btn-hover-bg-dark: linear-gradient(135deg, #4b7a86, #f8c26e);

        --text-muted-light: rgba(34, 34, 34, 0.7);
        --text-muted-dark: rgba(238, 238, 238, 0.7);
    }

    dialog {
        border: none;
        border-radius: 20px;
        width: 400px;
        max-width: 95vw;
        padding: 0;
        background: transparent;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
        transition: box-shadow 0.3s ease;
    }

    dialog::backdrop {
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
    }

    .login-modal {
        background: var(--bg-light);
        border-radius: 20px;
        padding: 40px 35px;
        color: var(--text-light);
        font-family: 'Inter', 'Roboto', Arial, sans-serif;
        position: relative;
        overflow: hidden;
        backdrop-filter: blur(8px);
        transition: background 0.5s ease, color 0.5s ease;
    }
    .login-modal.dark {
        background: var(--bg-dark);
        color: var(--text-dark);
        box-shadow: 0 8px 32px 0 rgba(58, 20, 103, 0.5),
        0 1.5px 6px 0 rgba(20, 20, 40, 0.3);
    }

    h1 {
        font-size: 32px;
        font-weight: 600;
        margin: 0 0 8px 0;
        letter-spacing: -0.5px;
        transition: color 0.5s ease;
    }
    .login-modal.dark h1 {
        color: var(--text-dark);
        text-shadow: 0 0 10px rgba(180, 160, 245, 0.7);
    }

    .subtitle {
        font-size: 14px;
        font-weight: 400;
        margin: 0 0 32px 0;
        color: var(--text-muted-light);
        transition: color 0.5s ease;
    }
    .login-modal.dark .subtitle {
        color: var(--text-muted-dark);
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .login-btn {
        background: var(--btn-bg-light);
        border: none;
        border-radius: 12px;
        padding: 16px 24px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        color: white;
        transition: all 0.3s ease;
        box-shadow: 0 8px 25px rgba(163, 206, 241, 0.35);
        font-family: inherit;
    }
    .login-btn:hover {
        background: var(--btn-hover-bg-light);
        box-shadow: 0 12px 35px rgba(163, 206, 241, 0.5);
        transform: translateY(-2px);
    }
    .login-modal.dark .login-btn {
        background: var(--btn-bg-dark);
        box-shadow: 0 8px 25px rgba(51, 92, 103, 0.7);
    }
    .login-modal.dark .login-btn:hover {
        background: var(--btn-hover-bg-dark);
        box-shadow: 0 12px 35px rgba(224, 159, 62, 0.85);
    }

    @media (max-width: 480px) {
        dialog {
            width: 90vw;
        }

        .login-modal {
            padding: 32px 24px;
        }

        h1 {
            font-size: 28px;
        }
    }
</style>