<script lang="ts">
	export let content: string;
	export let name: string;
	export let stars: number | undefined = undefined;
	export let avatar: string;
</script>

<div class="testimonialCard">
	<p class="content">“{@html content}”</p>
	<div class="userInfo">
		<img class="avatar" src={avatar} alt="{name} Avatar" />
		<div>
			{#if stars}
				<p class="stars">
					{#each Array(stars) as _, i}
						★
					{/each}
				</p>
			{/if}
			<p class="name">{name}</p>
		</div>
	</div>
</div>

<style>
	.testimonialCard {
		background-image: linear-gradient(
			-50deg,
			rgba(255, 255, 255, 0.5),
			rgba(255, 255, 255, 0.95) 80%
		);
		padding: 2em;
		border-radius: 0.75rem;
		box-shadow: rgba(0, 0, 0, 0.1) 5px 10px 5px -3px, rgba(0, 0, 0, 0.05) 0px 4px 46px -2px;
		max-width: 400px;
		width: 100%;
		color: #333;

		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		gap: 1em;

		font-size: 1.5rem;
	}

	.content {
		font-size: 0.8em;
		line-height: 1.6;
		margin-bottom: 15px;
		font-style: italic;
	}

	.userInfo {
		display: flex;
		align-items: center;
	}

	.avatar {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		margin-right: 15px;
	}

	.name {
		font-weight: bold;
		font-size: 0.8em;
		margin-bottom: 5px;
	}

	.stars {
		font-size: 0.75em;
		text-align: center;
		color: #f4b400; /* Star color */
	}

	@media screen and (max-width: 1200px) {
		.testimonialCard {
			gap: 0.75em;

			font-size: 1.15em;
		}
	}

	@media screen and (max-width: 768px) {
		.testimonialCard {
			font-size: 1.1rem;
		}
	}

	@media screen and (max-width: 500px) {
		.content {
			text-align: left;
		}
	}
</style>
