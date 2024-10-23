<script lang="ts">
	import { baseImageRoute } from '../stores'; // Importing the baseImageRoute
</script>

<div class="reviewsSection">
	<div class="review">
		<img src="{baseImageRoute}/googleReviews.png" alt="Google Reviews" />
		<p>4.7 estrellas en Google reviews</p>
	</div>
	<div class="review">
		<img src="{baseImageRoute}/facebookReviews.avif" alt="Facebook Reviews" />
		<p>5 estrellas en Facebook reviews</p>
	</div>
</div>

<style>
	.reviewsSection {
		background-color: #00133f; /* Dark blue background */
		padding: 50px;
		display: flex;
		justify-content: space-around;
		align-items: center;
		text-align: center;
		color: white;
		font-size: 1.5rem;
	}

	.review {
		flex: 1;
		margin: 0 20px;

		display: grid;
		place-items: center;
	}

	.review img {
		max-width: 200px;
		margin-bottom: 20px;
	}

	.review p {
		font-size: 1.2em;
		font-weight: bolder;
		text-wrap: balance;
		max-width: 20ch;
		text-align: center;
		margin: 0;
	}

	@media (max-width: 768px) {
		.reviewsSection {
			flex-direction: column;
			gap: 2rem;
			font-size: 1rem;
		}

		.review {
			margin: 20px 0;
		}
	}
</style>
