<script lang="ts">
	import Modal from './Modal.svelte';
	import { writable } from 'svelte/store';
	import { darkMode } from '$lib/stores/theme';

	export let data;

	$: userId = data?.userId ?? '';
	$: links = [
		{ href: '/', label: 'Home' },
		{ href: `/${userId}/dashboard`, label: 'My projects' },
		{ href: '/about', label: 'About' },
		{ href: '/contact', label: 'Contact' }
	];

	let showModal = false;
	let activeTab = 'register';

	function toggleTheme() {
		darkMode.update(v => !v);
	}

	function profileClick() {
		showModal = !showModal;
	}
</script>

<nav class="navbar" class:dark={$darkMode}>
	<div class="logo-section">
		<img src="/logoPhaint.png" alt="Logo" class="logo" />
		<span class="title">Phaint</span>
	</div>

	<ul class="links-section">
		{#each links as link}
			{#if !(link.href === `/${userId}/dashboard` && userId === '')}
				<li><a href={link.href} class="link">{link.label}</a></li>
			{/if}
		{/each}
	</ul>

	<div class="right-section">
		<!-- Theme toggle button -->
		<button class="theme-toggle" aria-label="Toggle theme" onclick={toggleTheme} aria-pressed={$darkMode}>
			<div class="icon-container" class:dark={$darkMode}>
				<svg class="sun" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<circle cx="12" cy="12" r="5" stroke-width="2" />
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					      d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.05l-1.414-1.414M6.464 6.464L5.05 5.05m12.728 0l-1.414 1.414M6.464 17.536l-1.414 1.414" />
				</svg>
				<svg class="moon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="none">
					<path
						d="M21 12.79A9 9 0 0111.21 3 7 7 0 1012 21a9 9 0 009-8.21z" />
				</svg>
			</div>
			<div class="slider" class:dark={$darkMode}></div>
		</button>

		<div class="profile-section" onclick={profileClick} role="button" tabindex="0" aria-label="User profile">
			<img src="/painter.png" alt="Profile" class="profile-pic" />
		</div>
	</div>

	<Modal bind:activeTab bind:showModal bind:userId />
</nav>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    .navbar {
        font-family: 'Inter', sans-serif;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(255 255 255 / 0.1);
        box-shadow: 0 4px 20px rgba(0 0 0 / 0.3);
        position: relative;
        background: linear-gradient(135deg, #f2f7ff, #d9e7ff);
        color: #222;
        transition:
                background 0.5s ease,
                color 0.5s ease;
    }

    .navbar.dark {
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        color: #eee;
        border-color: rgba(255 255 255 / 0.2);
    }

    /* Logo section */
    .logo-section {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        cursor: pointer;
    }

    .logo {
        width: 50px;
        height: 50px;
        border-radius: 12px;
        box-shadow: 0 4px 15px #a3cef1;
        transition: box-shadow 0.3s ease;
    }

    .navbar.dark .logo {
        box-shadow: 0 4px 15px #335c67;
    }

    .logo-section:hover .logo {
        box-shadow: 0 6px 20px #6ab2e4;
    }

    .title {
        font-weight: 600;
        font-size: 1.5rem;
        letter-spacing: -0.5px;
    }

    /* Links */
    .links-section {
        display: flex;
        gap: 2.5rem;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .link {
        font-weight: 500;
        font-size: 1rem;
        text-decoration: none;
        border-radius: 8px;
        position: relative;
        padding: 0.5rem 1rem;
        transition:
                color 0.3s ease,
                background-color 0.3s ease,
                box-shadow 0.3s ease;
        color: rgba(34, 34, 34, 0.9);
    }

    .navbar.dark .link {
        color: rgba(238, 238, 238, 0.9);
    }

    .link::before {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(163, 206, 241, 0.2);
        border-radius: 8px;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    }

    .link:hover::before {
        opacity: 1;
    }

    .link:hover {
        color: #2257a3;
        box-shadow: 0 4px 15px rgba(163, 206, 241, 0.4);
    }

    .navbar.dark .link:hover {
        color: #a3cef1;
        box-shadow: 0 4px 15px rgba(51, 92, 103, 0.5);
    }

    /* Right section containing profile and theme toggle */
    .right-section {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    /* Profile section */
    .profile-section {
        cursor: pointer;
        border-radius: 50%;
        padding: 0.05rem;
        background: rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .navbar.dark .profile-section {
        background: rgba(255, 255, 255, 0.1);
    }

    .profile-section:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 15px rgba(163, 206, 241, 0.5);
    }

    .profile-pic {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 1px solid transparent;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }

    .navbar.dark .profile-pic {
        border-color: rgba(163, 206, 241, 0.6);
        box-shadow: 0 0 0 3px rgba(51, 92, 103, 0.15);
    }

    .profile-section:hover .profile-pic {
        border-color: rgba(163, 206, 241, 0.9);
        box-shadow: 0 0 0 4px rgba(163, 206, 241, 0.3);
    }

    /* Theme toggle button */
    .theme-toggle {
        position: relative;
        border: none;
        background: transparent;
        cursor: pointer;
        width: 48px;
        height: 24px;
        border-radius: 16px;
        padding: 0;
        outline-offset: 2px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.15);
        transition: background-color 0.4s ease;
    }

    .theme-toggle:focus-visible {
        outline: 2px solid #a3cef1;
    }

    .icon-container {
        position: relative;
        width: 24px;
        height: 24px;
    }

    /* Sun icon */
    .icon-container .sun {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 20px;
        height: 20px;
        color: #fbbf24;
        opacity: 1;
        transition: opacity 0.4s ease;
    }
    .dark .icon-container .sun {
        opacity: 0;
    }

    /* Moon icon */
    .icon-container .moon {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 20px;
        height: 20px;
        color: #60a5fa;
        opacity: 0;
        transition: opacity 0.4s ease;
    }
    .dark .icon-container .moon {
        opacity: 1;
    }

    /* Slider indicator */
    .slider {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #fbbf24;
        box-shadow: 0 2px 8px rgba(251, 191, 36, 0.6);
        transition: transform 0.4s ease, background-color 0.4s ease;
    }
    .dark .slider {
        transform: translateX(24px);
        background-color: #60a5fa;
        box-shadow: 0 2px 8px rgba(96, 165, 250, 0.6);
    }

    /* Responsive */
    @media (max-width: 768px) {
        .links-section {
            gap: 1rem;
        }

        .title {
            font-size: 1.25rem;
        }
    }

    @media (max-width: 480px) {
        .links-section {
            display: none;
        }

        .navbar {
            padding: 1rem 1.25rem;
        }
    }
</style>
