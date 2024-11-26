<script>
    export let links = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' }
    ];
</script>

<nav class="navbar">
    <!-- Logo Section -->
    <div class="logo-section">
        <img src="phaint.jpg" alt="Flowbite Logo" class="logo" />
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
    <div class="profile-section">
        <img src="phaint.jpg" alt="Profile Picture" class="profile-pic" />
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
        gap: 0.5rem;
    }

    .logo {
        width: 40px;
        height: 40px;
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
