<script lang="ts">
  import { onMount } from 'svelte';
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
  <div class="modal-backdrop"></div>
  <div class="modal-form" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <h2 id="modal-title">Invitation Link</h2>

    <div class="link-container" tabindex="0" title="Invitation link (click to select)">
      {link}
    </div>

    <div class="modal-buttons">
      <button class="modal-primary" on:click={copyToClipboard}>
        {copySuccess ? 'Copied!' : 'Copy Link'}
      </button>
      <button class="modal-secondary" on:click={onClose}>Close</button>
    </div>
  </div>
{/if}

<style>
  /* existing styles optionally omitted for brevity, just add: */

  .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(32, 18, 48, 0.55);
        /* Slight blur for glass effect */
        backdrop-filter: blur(3.5px);
        z-index: 99;
    }

    .modal-form {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #2b193b 0%, #473275 100%);
        color: #fff;
        padding: 2.2rem 2.4rem;
        border-radius: 24px;
        box-shadow: 0 8px 32px 0 rgba(58, 20, 103, 0.32), 0 1.5px 6px 0 rgba(20,20,40,0.17);
        z-index: 100;
        display: flex;
        flex-direction: column;
        min-width: 370px;
        gap: 1.4rem;
        font-family: 'Inter', 'Roboto', Arial, sans-serif;
        /* Subtle glass effect */
        backdrop-filter: blur(8px);
    }
    h2#modal-title {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        margin-top: 0.4rem;
        letter-spacing: -0.03em;
        text-shadow: 0 2px 16px rgb(124,96,209, 0.15);
    }
    label {
        color: #d5d2e0;
        margin-bottom: 0.1rem;
        font-size: 1rem;
        font-weight: 500;
    }
    input[type="text"] {
        background: rgba(255,255,255,0.06);
        border-radius: 12px;
        border: none;
        outline: none;
        color: #fff;
        padding: 0.85rem 1.1rem;
        font-size: 1.06rem;
        box-shadow: inset 1px 2px 7px 0 rgba(70,40,110,0.07), 0px 1px 2px 0 rgba(70,40,110,0.04);
        margin-top: 0.15rem;
        margin-bottom: 1.5rem;
        transition: box-shadow 0.23s;
    }
    input[type="text"]:focus {
        box-shadow: 0 0 0 2px #ce63fa, 0 2px 16px 0 rgba(226, 138, 255, 0.11);
        background: rgba(255,255,255,0.12);
    }
    .modal-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 1.1rem;
        margin-top: 0.9rem;
    }
    .modal-primary {
        background: linear-gradient(90deg, #ac60ef 0%, #8635ec 100%);
        color: #fff;
        border: none;
        border-radius: 10px;
        padding: 0.7rem 1.6rem;
        font-size: 1rem;
        font-weight: 600;
        box-shadow: 0 4px 16px 0 rgba(184, 54, 255, 0.19);
        cursor: pointer;
        transition: background 0.19s, box-shadow 0.15s, transform 0.15s;
    }
    .modal-primary:hover,
    .modal-primary:focus {
        background: linear-gradient(90deg, #c073fa 5%, #a747ff 90%);
        box-shadow: 0 6px 20px 0 rgba(226, 138, 255, 0.23);
        transform: translateY(-1px) scale(1.03);
    }
    .modal-secondary {
        background: none;
        color: #e6d6f8;
        border: 1px solid #54346e;
        border-radius: 10px;
        padding: 0.7rem 1.4rem;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: color 0.17s;
    }
    .modal-secondary:hover,
    .modal-secondary:focus {
        background: rgba(160, 128, 220, 0.07);
        color: #eca1ff;
        border-color: #8b5dd7;
    }

  .link-container {
    user-select: all;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    border: 1.5px solid rgba(255, 255, 255, 0.25);
    padding: 0.9rem 1rem;
    font-family: monospace, monospace;
    font-size: 1.1rem;
    color: #eae6ff;
    box-shadow: inset 1px 2px 8px 0 rgba(80, 50, 135, 0.3);
    cursor: text;
    outline-offset: 3px;
    transition: border-color 0.2s ease;
  }
  .link-container:focus {
    border-color: #ce63fa;
    box-shadow: 0 0 8px 2px #ce63fa;
  }
</style>
