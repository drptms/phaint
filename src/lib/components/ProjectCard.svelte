<script>
	import { goto } from '$app/navigation';

	let { item = $bindable()} = $props();

	function handleClick() {
		goto(`/workboard/${item.PID}?name=${item.ProjectName}`);
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="card" onclick={handleClick}>
	<div class="image" style="background-image: url('');"></div>
	<div class="details">
		<div class="project-name">{item.ProjectName}</div>
		<div class="last-modified">{item.CreationDate}</div>
	</div>
</div>

<style>
    .card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        width: 90%; /* fixed width for consistent grid */
        height: 30vh;
        padding: 1rem; /* add padding for spacing inside */
        border-radius: 12px; /* slightly larger radius for smoothness */
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        background-color: #ffffff;
        overflow: hidden;
        text-align: center;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        cursor: pointer; /* clickable indication */
    }

    .card:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
    }


    .image {
        width: 100%;
        height: 80%;
        background-size: cover;
        background-position: center;
    }

    .details {
        padding: 10px;
    }

    .project-name {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 5px;
    }

    .last-modified {
        font-size: 12px;
        color: #555;
    }
</style>
