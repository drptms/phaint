<script lang="ts">
	import { onMount } from 'svelte';
	import { darkMode } from '$lib/stores/theme';

	export let open = false;
	export let onClose: () => void;

	onMount(() => {
		function handleKey(e: KeyboardEvent) {
			if (e.key === 'Escape') onClose();
		}
		window.addEventListener('keydown', handleKey);
		return () => window.removeEventListener('keydown', handleKey);
	});
</script>
{#if open}
	<div class="modal-backdrop"  class:dark={$darkMode}></div>
	<form
		class="modal-form" class:dark={$darkMode}
		method="POST"
		action="?/acceptInvitation"
		role="search"
		aria-labelledby="modal-title"
	>
		<h2 id="modal-title" class:dark={$darkMode}>Accept Invitation</h2>

		<label for="pname-input" class:dark={$darkMode}>Link:</label>
		<input id="pname-input" class:dark={$darkMode} name="invite" type="text" autocomplete="off" required />

		<div class="modal-buttons" class:dark={$darkMode}>
			<button type="submit" class="modal-primary" class:dark={$darkMode}>Accept</button>
			<button type="button" class="modal-secondary" class:dark={$darkMode} onclick={onClose}>Cancel</button>
		</div>
	</form>
{/if}

<style>
    :root {
        --modal-bg-light: linear-gradient(135deg, #e7e9fc, #cddbff);
        --modal-bg-dark: linear-gradient(135deg, #2b193b, #473275);

        --text-light: #222;
        --text-dark: #eee;

        --label-color-light: #444;
        --label-color-dark: #d5d2e0;

        --input-bg-light: rgba(255, 255, 255, 0.7);
        --input-bg-dark: rgba(255, 255, 255, 0.1);

        --input-color-light: #000;
        --input-color-dark: #fff;

        --input-box-shadow-light: inset 1px 2px 7px 0 rgba(70, 40, 110, 0.1), 0 1px 2px 0 rgba(70, 40, 110, 0.06);
        --input-box-shadow-dark: inset 1px 2px 7px 0 rgba(70, 40, 110, 0.07), 0 1px 2px 0 rgba(70, 40, 110, 0.04);

        --btn-primary-bg-light: linear-gradient(90deg, #a3cef1 0%, #ffcbcb 100%);
        --btn-primary-bg-dark: linear-gradient(90deg, #335c67 0%, #e09f3e 100%);

        --btn-primary-hover-light: linear-gradient(90deg, #c0dbfb 5%, #ffc0c0 90%);
        --btn-primary-hover-dark: linear-gradient(90deg, #4b7a86 5%, #f8c26e 90%);

        --btn-secondary-color-light: #555;
        --btn-secondary-color-dark: #e6d6f8;

        --btn-secondary-border-light: #999;
        --btn-secondary-border-dark: #54346e;

        --btn-secondary-hover-bg-light: rgba(160, 128, 220, 0.07);
        --btn-secondary-hover-bg-dark: rgba(224, 159, 62, 0.07);

        --btn-secondary-hover-color-light: #7744ff;
        --btn-secondary-hover-color-dark: #eca1ff;
    }

    .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(32, 18, 48, 0.55);
        backdrop-filter: blur(3.5px);
        z-index: 99;
    }
    .modal-backdrop.dark {
        background: rgba(20, 15, 40, 0.75);
    }
    .modal-backdrop:not(.dark) {
        background: rgba(250, 250, 255, 0.7);
    }

    .modal-form {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--modal-bg-light);
        color: var(--text-light);
        padding: 2.2rem 2.4rem;
        border-radius: 24px;
        box-shadow: 0 8px 32px 0 rgba(58, 20, 103, 0.25), 0 1.5px 6px 0 rgba(20,20,40,0.1);
        z-index: 100;
        display: flex;
        flex-direction: column;
        min-width: 370px;
        gap: 1.4rem;
        font-family: 'Inter', 'Roboto', Arial, sans-serif;
        backdrop-filter: blur(8px);
        transition: background 0.5s ease, color 0.5s ease;
    }
    .modal-form.dark {
        background: var(--modal-bg-dark);
        color: var(--text-dark);
        box-shadow: 0 8px 32px 0 rgba(58, 20, 103, 0.5), 0 1.5px 6px 0 rgba(20,20,40,0.3);
    }

    h2#modal-title {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        margin-top: 0.4rem;
        letter-spacing: -0.03em;
        text-shadow: 0 2px 16px rgba(124, 96, 209, 0.15);
        transition: color 0.3s ease;
    }
    .modal-form.dark h2#modal-title {
        text-shadow: 0 2px 16px rgba(180, 160, 245, 0.25);
    }

    label {
        color: var(--label-color-light);
        margin-bottom: 0.1rem;
        font-size: 1rem;
        font-weight: 500;
        transition: color 0.5s ease;
    }
    .modal-form.dark label {
        color: var(--label-color-dark);
    }

    input[type="text"] {
        background: var(--input-bg-light);
        border-radius: 12px;
        border: none;
        outline: none;
        color: var(--input-color-light);
        padding: 0.85rem 1.1rem;
        font-size: 1.06rem;
        box-shadow: var(--input-box-shadow-light);
        margin-top: 0.15rem;
        margin-bottom: 1.5rem;
        transition: background 0.3s ease, box-shadow 0.3s ease, color 0.3s ease;
    }
    .modal-form.dark input[type="text"] {
        background: var(--input-bg-dark);
        color: var(--input-color-dark);
        box-shadow: var(--input-box-shadow-dark);
    }
    input[type="text"]:focus {
        box-shadow: 0 0 0 2px #ce63fa, 0 2px 16px 0 rgba(226, 138, 255, 0.11);
        background: rgba(255, 255, 255, 0.12);
    }

    .modal-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 1.1rem;
        margin-top: 0.9rem;
    }

    .modal-primary {
        background: var(--btn-primary-bg-light);
        color: #fff;
        border: none;
        border-radius: 10px;
        padding: 0.7rem 1.6rem;
        font-size: 1rem;
        font-weight: 600;
        box-shadow: 0 4px 16px 0 rgba(184, 54, 255, 0.19);
        cursor: pointer;
        transition: background 0.3s ease, box-shadow 0.15s ease, transform 0.15s ease;
    }
    .modal-primary:hover,
    .modal-primary:focus {
        background: var(--btn-primary-hover-light);
        box-shadow: 0 6px 20px 0 rgba(226, 138, 255, 0.23);
        transform: translateY(-1px) scale(1.03);
    }
    .modal-form.dark .modal-primary {
        background: var(--btn-primary-bg-dark);
        box-shadow: 0 4px 16px 0 rgba(51, 92, 103, 0.5);
    }
    .modal-form.dark .modal-primary:hover,
    .modal-form.dark .modal-primary:focus {
        background: var(--btn-primary-hover-dark);
        box-shadow: 0 6px 20px 0 rgba(224, 159, 62, 0.7);
    }

    .modal-secondary {
        background: none;
        color: var(--btn-secondary-color-light);
        border: 1px solid var(--btn-secondary-border-light);
        border-radius: 10px;
        padding: 0.7rem 1.4rem;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: color 0.17s ease;
    }
    .modal-secondary:hover,
    .modal-secondary:focus {
        background: var(--btn-secondary-hover-bg-light);
        color: var(--btn-secondary-hover-color-light);
        border-color: #8b5dd7;
    }
    .modal-form.dark .modal-secondary {
        color: var(--btn-secondary-color-dark);
        border-color: var(--btn-secondary-border-dark);
    }
    .modal-form.dark .modal-secondary:hover,
    .modal-form.dark .modal-secondary:focus {
        background: var(--btn-secondary-hover-bg-dark);
        color: var(--btn-secondary-hover-color-dark);
        border-color: #e0a940;
    }
</style>