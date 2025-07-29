<script>
	let {item = $bindable()} = $props()
</script>

<div class="card">
	<div class="image" style="background-image: url('{item.imageUrl}');"></div>
	<div class="details">
		<div class="project-name">{item.projectName}</div>
		<div class="last-modified">{item.lastModified}</div>
	</div>
</div>

<style>
	.card {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		width: 20%;
		height: 250px;
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		background-color: #fff;
		overflow: hidden;
		text-align: center;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
	}

	.card:hover {
		transform: translateY(-5px);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
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
		font-size: 16px;
		font-weight: bold;
		margin-bottom: 5px;
	}

	.last-modified {
		font-size: 12px;
		color: #555;
	}
</style>
