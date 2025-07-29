<script>
	let { showModal = $bindable(), switchModal } = $props();

	let dialog = $state(); // HTMLDialogElement


    $effect(() => {
        if (showModal) dialog.showModal();
    });
</script>

<!-- The Login Dialog -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog id="loginDialog"
	bind:this={dialog}
    onclose={() => (showModal = false)}
    onclick={(e) => { if (e.target === dialog) dialog.close(); }}>>
	<div class="login-modal">
		<h1>Sign up</h1>
		<p class="subtitle">Keep it all together and you'll be fine</p>
		
		<form id="loginForm" method="POST" action="/register?/register">
			<input type="text" id="username" name="username" placeholder="Email or Phone" required />
			<input type="email" id="mail" name="mail" placeholder="Mail" required />
			<input type="password" id="password" name="password" placeholder="Password" required />
			
			<div class="forgot-password">
				<!-- svelte-ignore a11y_invalid_attribute -->
				<a href="#">Forgot Password</a>
			</div>

			<button type="submit" class="sign-in-btn">Register now!</button>
		</form>
		
		<div class="divider">
			<span>or</span>
		</div>
		
		<div class="signup-link">
			<!-- svelte-ignore a11y_invalid_attribute -->
			Not new on Phaint? <a href="#" onclick={(e) => { e.preventDefault(); switchModal(); }}>Login</a>
		</div>
	</div>
</dialog>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

	dialog {
		border: none;
		border-radius: 20px;
		width: 400px;
		max-width: 95vw;
		padding: 0;
		background: transparent;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
	}

	.login-modal {
		background: linear-gradient(135deg, 
			rgba(20, 15, 40, 0.98) 0%, 
			rgba(35, 25, 60, 0.95) 50%, 
			rgba(50, 35, 80, 0.92) 100%);
		border-radius: 20px;
		padding: 40px 35px;
		color: white;
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		position: relative;
		overflow: hidden;
	}

	.login-modal::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, 
			rgba(138, 43, 226, 0.1) 0%, 
			rgba(30, 144, 255, 0.05) 100%);
		border-radius: 20px;
		pointer-events: none;
	}

	.login-modal > * {
		position: relative;
		z-index: 1;
	}

	h1 {
		font-size: 32px;
		font-weight: 600;
		margin: 0 0 8px 0;
		color: white;
		letter-spacing: -0.5px;
	}

	.subtitle {
		color: rgba(255, 255, 255, 0.7);
		font-size: 14px;
		margin: 0 0 32px 0;
		font-weight: 400;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	input[type="text"],
	input[type="email"],
	input[type="password"] {
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 12px;
		padding: 16px 18px;
		color: white;
		font-size: 16px;
		font-family: inherit;
		transition: all 0.3s ease;
		backdrop-filter: blur(10px);
	}

	input[type="text"]:focus,
	input[type="email"]:focus,
	input[type="password"]:focus {
		outline: none;
		border-color: rgba(138, 43, 226, 0.6);
		box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.15);
		background: rgba(255, 255, 255, 0.12);
	}

	::placeholder {
		color: rgba(255, 255, 255, 0.5);
	}

	.forgot-password {
		text-align: right;
		margin-top: -8px;
		margin-bottom: 8px;
	}

	.forgot-password a {
		color: rgba(255, 255, 255, 0.7);
		text-decoration: none;
		font-size: 14px;
		transition: color 0.3s ease;
	}

	.forgot-password a:hover {
		color: rgba(138, 43, 226, 0.9);
	}

	.sign-in-btn {
		background: linear-gradient(135deg, #8a2be2 0%, #9932cc 100%);
		border: none;
		border-radius: 12px;
		padding: 16px 24px;
		color: white;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 8px 25px rgba(138, 43, 226, 0.3);
		font-family: inherit;
	}

	.sign-in-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 35px rgba(138, 43, 226, 0.4);
		background: linear-gradient(135deg, #9932cc 0%, #8a2be2 100%);
	}

	.divider {
		text-align: center;
		margin: 32px 0;
		position: relative;
	}

	.divider::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		height: 1px;
		background: rgba(255, 255, 255, 0.15);
	}

	.divider span {
		background: inherit;
		padding: 0 20px;
		color: rgba(255, 255, 255, 0.6);
		font-size: 14px;
	}

	.signup-link {
		text-align: center;
		margin-top: 24px;
		color: rgba(255, 255, 255, 0.7);
		font-size: 14px;
	}

	.signup-link a {
		color: rgba(138, 43, 226, 0.9);
		text-decoration: none;
		font-weight: 500;
		transition: color 0.3s ease;
	}

	.signup-link a:hover {
		color: #8a2be2;
	}

	/* Responsive adjustments */
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