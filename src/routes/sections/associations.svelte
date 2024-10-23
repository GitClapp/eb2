<script lang="ts">
	import { baseImageRoute } from '../stores'; // Importing the baseImageRoute
</script>

<div class="associationsSection">
	<h2>Somos parte de</h2>
	<div class="logoContainer">
		<img src="{baseImageRoute}/aba.avif" alt="ABA Logo" />
		<img src="{baseImageRoute}/dcBar.avif" alt="DC Bar Logo" />
		<img src="{baseImageRoute}/aila.avif" alt="AILA Logo" />
		<img src="{baseImageRoute}/mhba.avif" alt="MHBA Logo" />
	</div>
</div>

<style>
	.associationsSection {
		background-color: #f27931; /* The orange background color */
		padding: 50px;
		text-align: center;
		color: white;

		display: flex;
		gap: 50px;
		align-items: center;
		justify-content: space-around;
		font-size: 1.5rem;
	}

	.associationsSection h2 {
		font-size: 1.5em;
		margin-bottom: 20px;
	}

	.logoContainer {
		display: flex;
		justify-content: center;
		gap: 40px;
		flex-wrap: wrap;
	}

	.logoContainer img {
		max-width: 120px;
	}

	@media (max-width: 768px) {
		.associationsSection {
			flex-direction: column;
			gap: 20px;
			font-size: 1rem;
		}
		.logoContainer {
			gap: 20px;
		}

		.logoContainer img {
			max-width: 100px;
		}
	}
</style>
