<script>
    export let links = [
        { href: '/', label: 'Home' },
        { href: '/dashboard', label: 'My projects'},
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
    ];
    // TODO
    function profileClick() {
        console.log("Clicked!")
    }
</script>

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
    <div class="profile-section" on:click={profileClick}>
        <img src="logoPhaint.png" alt="Profile Picture" class="profile-pic" />
    </div>
</nav>

<style>
    .navbar {
        background-color: #1a202c;
        padding: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .logo-section {
        display: flex;
        align-items: center;
        gap: 0.1rem;
    }

    .logo {
        width: 50px;
        height: 50px;
    }

    .title {
        color: white;
        font-size: 1.25rem;
        font-weight: bold;
    }

    .links-section {
        display: flex;
        gap: 2rem;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .link {
        color: white;
        text-decoration: none;
        font-size: 1rem;
    }

    .link:hover {
        text-decoration: underline;
    }

    .profile-section {
        display: flex;
        align-items: center;
    }

    .profile-pic {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }
</style>
