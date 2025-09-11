<script>
	let { showModal = $bindable(), switchModal } = $props();
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
				onclick={(e) => { if (e.target === dialog) dialog.close(); }}>>
	<div class="login-modal" class:dark={$darkMode}>
		<h1 class:dark={$darkMode}>Sign up</h1>
		<p class="subtitle" class:dark={$darkMode}>Keep it all together and you'll be fine</p>

		<form id="loginForm" class:dark={$darkMode} method="POST" action="/register?/register">
			<input type="text" id="username" class:dark={$darkMode} name="username" placeholder="Username" required />
			<input type="email" id="mail" class:dark={$darkMode} name="mail" placeholder="Mail" required />
			<input type="password" id="password" class:dark={$darkMode} name="password" placeholder="Password" required />

			<div class="forgot-password" class:dark={$darkMode}>
				<!-- svelte-ignore a11y_invalid_attribute -->
				<a href="#" class:dark={$darkMode}>Forgot Password</a>
			</div>

			<button type="submit" class="sign-in-btn" class:dark={$darkMode}>Register now!</button>
		</form>

		<div class="divider" class:dark={$darkMode}>
			<span class:dark={$darkMode}>or</span>
		</div>

		<div class="signup-link" class:dark={$darkMode}>
			<!-- svelte-ignore a11y_invalid_attribute -->
			Not new on Phaint? <a href="#" class:dark={$darkMode} onclick={(e) => { e.preventDefault(); switchModal(); }}>Login</a>
		</div>
	</div>
</dialog>

<style>
    :root {
        --bg-light: linear-gradient(135deg, #e7e9fc, #cddbff);
        --bg-dark: linear-gradient(135deg, #2b193b, #473275);

        --text-light: #222;
        --text-dark: #eee;

        --placeholder-light: rgba(0, 0, 0, 0.45);
        --placeholder-dark: rgba(255, 255, 255, 0.5);

        --input-bg-light: rgba(255, 255, 255, 0.8);
        --input-bg-dark: rgba(255, 255, 255, 0.1);

        --input-border-light: rgba(0, 0, 0, 0.15);
        --input-border-dark: rgba(255, 255, 255, 0.15);

        --btn-bg-light: linear-gradient(135deg, #a3cef1, #ffcbcb);
        --btn-bg-dark: linear-gradient(135deg, #335c67, #e09f3e);

        --btn-hover-bg-light: linear-gradient(135deg, #c0dbfb, #ffc0c0);
        --btn-hover-bg-dark: linear-gradient(135deg, #4b7a86, #f8c26e);

        --link-color-light: rgba(20, 15, 40, 0.8);
        --link-hover-light: #6a47ff;

        --link-color-dark: rgba(138, 43, 226, 0.9);
        --link-hover-dark: #a070ff;
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
        color: var(--text-light);
        border-radius: 20px;
        padding: 40px 35px;
        position: relative;
        overflow: hidden;
        font-family: 'Inter', 'Roboto', Arial, sans-serif;
        backdrop-filter: blur(8px);
        transition: background 0.5s ease, color 0.5s ease;
    }
    .login-modal.dark {
        background: var(--bg-dark);
        color: var(--text-dark);
        box-shadow: 0 8px 32px 0 rgba(58, 20, 103, 0.5), 0 1.5px 6px 0 rgba(20, 20, 40, 0.3);
    }

    h1 {
        font-size: 32px;
        font-weight: 600;
        margin: 0 0 8px 0;
        letter-spacing: -0.5px;
    }

    .subtitle {
        font-size: 14px;
        font-weight: 400;
        margin: 0 0 32px 0;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    input[type='text'],
    input[type='email'],
    input[type='password'] {
        background: var(--input-bg-light);
        border: 1px solid var(--input-border-light);
        border-radius: 12px;
        padding: 16px 18px;
        font-size: 16px;
        color: var(--text-light);
        font-family: inherit;
        transition: all 0.3s ease;
        outline: none;
        backdrop-filter: blur(10px);
    }
    .login-modal.dark input[type='text'],
    .login-modal.dark input[type='email'],
    .login-modal.dark input[type='password'] {
        background: var(--input-bg-dark);
        border: 1px solid var(--input-border-dark);
        color: var(--text-dark);
    }
    input[type='text']:focus,
    input[type='email']:focus,
    input[type='password']:focus {
        outline: none;
        border-color: rgba(138, 43, 226, 0.6);
        box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.15);
        background: rgba(255, 255, 255, 0.12);
    }

    ::placeholder {
        color: var(--placeholder-light);
    }
    .login-modal.dark ::placeholder {
        color: var(--placeholder-dark);
    }

    .forgot-password {
        text-align: right;
        font-size: 14px;
        margin-top: -8px;
        margin-bottom: 8px;
    }
    .forgot-password a {
        color: var(--link-color-light);
        text-decoration: none;
        transition: color 0.3s ease;
    }
    .login-modal.dark .forgot-password a {
        color: var(--link-color-dark);
    }
    .forgot-password a:hover {
        color: var(--link-hover-light);
    }
    .login-modal.dark .forgot-password a:hover {
        color: var(--link-hover-dark);
    }

    .sign-in-btn {
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
    .sign-in-btn:hover {
        background: var(--btn-hover-bg-light);
        box-shadow: 0 12px 35px rgba(163, 206, 241, 0.5);
        transform: translateY(-2px);
    }
    .login-modal.dark .sign-in-btn {
        background: var(--btn-bg-dark);
        box-shadow: 0 8px 25px rgba(51, 92, 103, 0.7);
    }
    .login-modal.dark .sign-in-btn:hover {
        background: var(--btn-hover-bg-dark);
        box-shadow: 0 12px 35px rgba(224, 159, 62, 0.85);
    }

    .divider {
        position: relative;
        text-align: center;
        margin: 32px 0;
    }
    .divider::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background: rgba(34, 34, 34, 0.15);
    }
    .login-modal.dark .divider::before {
        background: rgba(255, 255, 255, 0.15);
    }
    .divider span {
        background: inherit;
        padding: 0 20px;
        font-size: 14px;
        color: rgba(34, 34, 34, 0.5);
    }
    .login-modal.dark .divider span {
        color: rgba(238, 238, 238, 0.5);
    }

    .signup-link {
        text-align: center;
        font-size: 14px;
        color: rgba(34, 34, 34, 0.7);
    }
    .login-modal.dark .signup-link {
        color: rgba(238, 238, 238, 0.7);
    }
    .signup-link a {
        color: var(--link-color-dark);
        font-weight: 500;
        text-decoration: none;
        cursor: pointer;
        transition: color 0.3s ease;
    }
    .signup-link a:hover {
        color: var(--link-hover-dark);
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