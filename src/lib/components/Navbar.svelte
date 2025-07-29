<script>
    import Modal from "./Modal.svelte";
    
    // Accept data from the layout
    export let data;
    
    $: userToken = data?.userToken ?? '5';

    $: links = [
        { href: '/', label: 'Home' },
        { href: `/${userToken}/dashboard`, label: 'My projects'},
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
    ];
    
    let showModal = false;
    let activeTab = 'register'
    
    function profileClick() {
        showModal = !showModal;
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<nav class="navbar">
    <!-- Logo Section -->
    <div class="logo-section">
        <img src="logoPhaint.png" alt="Flowbite Logo" class="logo" />
        <span class="title">Phaint</span>
    </div>

    <!-- Links Section -->
    <ul class="links-section">
        {#each links as link}
            <li>
                <a href={link.href} class="link">{link.label}</a>
            </li>
        {/each}
    </ul>

    <!-- Profile Section -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="profile-section" on:click={profileClick}>
        <img src="logoPhaint.png" alt="" class="profile-pic" />
    </div>

    <Modal bind:activeTab bind:showModal/>
</nav>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    .navbar {
        background: linear-gradient(135deg, 
            rgba(20, 15, 40, 0.98) 0%, 
            rgba(35, 25, 60, 0.95) 50%, 
            rgba(50, 35, 80, 0.92) 100%);
        padding: 1rem 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        position: relative;
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .navbar::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, 
            rgba(138, 43, 226, 0.05) 0%, 
            rgba(30, 144, 255, 0.02) 100%);
        pointer-events: none;
    }

    .navbar > * {
        position: relative;
        z-index: 1;
    }

    .logo-section {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        transition: transform 0.3s ease;
    }

    .logo-section:hover {
        transform: scale(1.05);
    }

    .logo {
        width: 50px;
        height: 50px;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(138, 43, 226, 0.2);
        transition: all 0.3s ease;
    }

    .logo:hover {
        box-shadow: 0 6px 20px rgba(138, 43, 226, 0.3);
    }

    .title {
        color: white;
        font-size: 1.5rem;
        font-weight: 600;
        letter-spacing: -0.5px;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }

    .links-section {
        display: flex;
        gap: 2.5rem;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .link {
        color: rgba(255, 255, 255, 0.9);
        text-decoration: none;
        font-size: 1rem;
        font-weight: 500;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        transition: all 0.3s ease;
        position: relative;
        backdrop-filter: blur(10px);
    }

    .link::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .link:hover::before {
        opacity: 1;
    }

    .link:hover {
        color: white;
        transform: translateY(-2px);
        text-shadow: 0 2px 10px rgba(138, 43, 226, 0.5);
        box-shadow: 0 4px 15px rgba(138, 43, 226, 0.2);
    }

    .profile-section {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 50%;
        transition: all 0.3s ease;
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
    }

    .profile-section:hover {
        transform: scale(1.1);
        background: rgba(255, 255, 255, 0.1);
        box-shadow: 0 6px 20px rgba(138, 43, 226, 0.3);
    }

    .profile-pic {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;
    }

    .profile-section:hover .profile-pic {
        border-color: rgba(138, 43, 226, 0.6);
        box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.15);
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .navbar {
            padding: 1rem;
        }
        
        .links-section {
            gap: 1.5rem;
        }
        
        .link {
            font-size: 0.9rem;
            padding: 0.4rem 0.8rem;
        }
        
        .title {
            font-size: 1.25rem;
        }
    }

    @media (max-width: 480px) {
        .navbar {
            padding: 0.75rem;
        }
        
        .links-section {
            display: none; /* You might want to implement a mobile menu here */
        }
        
        .logo-section {
            gap: 0.5rem;
        }
        
        .title {
            font-size: 1.1rem;
        }
    }
</style>
