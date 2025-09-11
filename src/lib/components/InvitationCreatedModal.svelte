<script lang="ts">
  import { onMount } from 'svelte';
  import { darkMode } from '$lib/stores/theme';

  export let open = false;
  export let onClose: () => void;
  export let link: string;

  let copySuccess = false;
  let copyTimeout: ReturnType<typeof setTimeout>;

  function copyToClipboard() {
    navigator.clipboard.writeText(link).then(() => {
      copySuccess = true;
      clearTimeout(copyTimeout);
      copyTimeout = setTimeout(() => {
        copySuccess = false;
      }, 2000);
    });
  }

  onMount(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });
</script>

{#if open}
  <div class="modal-backdrop" class:dark={$darkMode}></div>
  <div class="modal-form" class:dark={$darkMode} role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <h2 id="modal-title" class:dark={$darkMode}>Invitation Link</h2>

    <div class="link-container" class:dark={$darkMode} tabindex="-1" title="Invitation link (click to select)">
      {link}
    </div>

    <div class="modal-buttons" class:dark={$darkMode}>
      <button class="modal-primary" class:dark={$darkMode} onclick={copyToClipboard}>
        {copySuccess ? 'Copied!' : 'Copy Link'}
      </button>
      <button class="modal-secondary" class:dark={$darkMode} onclick={onClose}>Close</button>
    </div>
  </div>
{/if}

<style>
    :root {
        /* Light mode palette */
        --bg-light: linear-gradient(135deg, #f2f7ff, #d9e7ff);
        --modal-bg-light: linear-gradient(135deg, #e7e9fc, #cddbff);
        --primary-light: linear-gradient(90deg, #a3cef1 0%, #ffcbcb 100%);
        --primary-hover-light: linear-gradient(90deg, #c0dbfb 5%, #ffc0c0 90%);
        --secondary-border-light: #a3b1da;
        --secondary-color-light: #6b7393;
        --text-light: #222;
        --link-bg-light: rgba(255, 255, 255, 0.3);
        --link-border-light: rgba(255, 255, 255, 0.5);
        --link-shadow-light: rgba(80, 130, 220, 0.3);

        /* Dark mode palette */
        --bg-dark: linear-gradient(135deg, #1a1a2e, #16213e);
        --modal-bg-dark: linear-gradient(135deg, #2b193b, #473275);
        --primary-dark: linear-gradient(90deg, #335c67 0%, #e09f3e 100%);
        --primary-hover-dark: linear-gradient(90deg, #4b7a86 5%, #f8c26e 90%);
        --secondary-border-dark: #54346e;
        --secondary-color-dark: #d6b9ff;
        --text-dark: #eee;
        --link-bg-dark: rgba(255, 255, 255, 0.1);
        --link-border-dark: rgba(255, 255, 255, 0.25);
        --link-shadow-dark: rgba(80, 50, 135, 0.3);
    }

    /* Backdrop */
    .modal-backdrop {
        position: fixed;
        inset: 0;
        background: var(--bg-dark);
        opacity: 0.85;
        backdrop-filter: blur(4px);
        z-index: 998;
    }
    .modal-backdrop.dark {
        background: var(--bg-dark);
    }
    .modal-backdrop:not(.dark) {
        background: var(--bg-light);
        opacity: 0.7;
    }

    /* Modal container */
    .modal-form {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--modal-bg-light);
        color: var(--text-light);
        padding: 2.2rem 2.4rem;
        border-radius: 24px;
        box-shadow:
                0 8px 32px 0 rgba(58, 20, 103, 0.15),
                0 1.5px 6px 0 rgba(20, 20, 40, 0.1);
        z-index: 999;
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
        box-shadow:
                0 8px 32px 0 rgba(58, 20, 103, 0.32),
                0 1.5px 6px 0 rgba(20, 20, 40, 0.17);
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

    .modal-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 1.1rem;
        margin-top: 0.9rem;
    }

    .modal-primary {
        background: var(--primary-light);
        color: white;
        border: none;
        border-radius: 10px;
        padding: 0.7rem 1.6rem;
        font-size: 1rem;
        font-weight: 600;
        box-shadow: 0 4px 16px 0 rgba(184, 54, 255, 0.19);
        cursor: pointer;
        transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.15s ease;
    }
    .modal-primary:hover,
    .modal-primary:focus {
        background: var(--primary-hover-light);
        box-shadow: 0 6px 20px 0 rgba(226, 138, 255, 0.23);
        transform: translateY(-1px) scale(1.03);
    }
    .modal-form.dark .modal-primary {
        background: var(--primary-dark);
        box-shadow: 0 4px 16px 0 rgba(51, 92, 103, 0.5);
    }
    .modal-form.dark .modal-primary:hover,
    .modal-form.dark .modal-primary:focus {
        background: var(--primary-hover-dark);
        box-shadow: 0 6px 20px 0 rgba(224, 159, 62, 0.7);
    }

    .modal-secondary {
        background: none;
        color: var(--secondary-color-light);
        border: 1px solid var(--secondary-border-light);
        border-radius: 10px;
        padding: 0.7rem 1.4rem;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: color 0.25s ease, background 0.25s ease, border-color 0.25s ease;
    }
    .modal-secondary:hover,
    .modal-secondary:focus {
        background: rgba(160, 128, 220, 0.07);
        color: #eca1ff;
        border-color: #8b5dd7;
    }
    .modal-form.dark .modal-secondary {
        color: var(--secondary-color-dark);
        border-color: var(--secondary-border-dark);
    }
    .modal-form.dark .modal-secondary:hover,
    .modal-form.dark .modal-secondary:focus {
        background: rgba(224, 159, 62, 0.07);
        color: #eec779;
        border-color: #e0a940;
    }

    .link-container {
        user-select: all;
        background: var(--link-bg-light);
        border-radius: 12px;
        border: 1.5px solid var(--link-border-light);
        padding: 0.9rem 1rem;
        font-family: monospace, monospace;
        font-size: 1.1rem;
        color: var(--text-light);
        box-shadow: inset 1px 2px 8px 0 var(--link-shadow-light);
        cursor: text;
        outline-offset: 3px;
        transition: border-color 0.2s ease, background-color 0.3s ease;
    }
    .link-container:focus {
        border-color: #ce63fa;
        box-shadow: 0 0 8px 2px #ce63fa;
    }
    .modal-form.dark .link-container {
        background: var(--link-bg-dark);
        border: 1.5px solid var(--link-border-dark);
        color: var(--text-dark);
        box-shadow: inset 0 2px 8px 0 var(--link-shadow-dark);
    }
</style>