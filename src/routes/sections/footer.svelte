<script lang="ts">
	import { baseImageRoute, baseRoute } from '../stores'; // Importing the baseImageRoute
</script>

<footer class="footerSection">
	<div class="footerLeft">
		<a href={baseRoute}>
			<img src="{baseImageRoute}/logo.avif" alt="Canto Legal Logo" class="footerLogo" />
		</a>
		<div class="socialMedia">
			<a
				href="https://www.facebook.com/KatherineCantoLegal/"
				target="_blank"
				rel="noopener noreferrer"
			>
				<img src="{baseImageRoute}/facebook.png" alt="Facebook" />
			</a>
			<a
				href="https://www.youtube.com/channel/UCJOhBEuelL2oY1eYxsd7qaA"
				target="_blank"
				rel="noopener noreferrer"
			>
				<img src="{baseImageRoute}/youtube.png" alt="YouTube" />
			</a>
			<a
				href="hhttps://www.instagram.com/katherinecantolegal"
				target="_blank"
				rel="noopener noreferrer"
			>
				<img src="{baseImageRoute}/instagram.png" alt="Instagram" />
			</a>
		</div>
		<p>
			<a class="email" href="mailto:info@cantolegal.com">
				<img src="{baseImageRoute}/email.png" alt="Email Icon" class="emailIcon" />
				info@cantolegal.com
			</a>
		</p>
		<address>
			22W. Pennsylvania Ave. Suite 500,<br />
			Towson, MD 21204
		</address>
	</div>

	<div class="footerRight">
		<a href="{baseRoute}/solicitudes" target="_blank" rel="noopener noreferrer">
			<img
				src="{baseImageRoute}/expertiseAward.webp"
				alt="Expertise Award"
				class="awardImage"
			/>
		</a>
		<p>Law office of Katherine Canto &copy; 2024, todos los derechos reservados.</p>
		<p class="disclaimer">
			La abogada Katherine Canto es miembro del Colegio de Abogados del Estado de Washington,
			D.C. La información contenida en esta página electrónica, es solo con fines de
			informativos. Esta información no tiene la intención de considerarse consejo legal o
			representación. El uso de esta página no crea alguna relación de abogado-cliente entre
			Katherine Canto y el lector.
		</p>
	</div>
</footer>

<style>
	.footerSection {
		background-color: #000c25; /* Dark blue background */
		color: white;
		padding: 4em 6em;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 2em;
		font-size: 1.1rem;
		font-weight: 300;
	}

	@media screen and (min-width: 1500px) {
		.footerSection {
			padding: 4em 12em;
		}
	}

	.footerLogo {
		width: 150px;
		margin-bottom: 20px;
	}

	.socialMedia {
		display: flex;
		gap: 2em;
		margin-bottom: 20px;
	}

	.socialMedia img {
		width: 30px;
		height: 30px;
	}

	.email {
		display: flex;
		align-items: center;
		font-weight: 600;
	}

	.emailIcon {
		width: 20px;
		margin-right: 10px;
	}

	.footerRight {
		display: flex;
		flex-direction: column;
		align-items: end;
		justify-content: end;
		gap: 0.5em;
		text-align: right;
	}

	.disclaimer {
		margin-top: 10px;
		max-width: 60ch;
		font-size: 0.9em;
		line-height: 1.5;
	}

	.awardImage {
		width: 120px;
	}

	address {
		margin-top: 1.5em;
		font-style: normal;
	}

	@media (max-width: 768px) {
		.footerSection {
			flex-direction: column;
			text-align: center;
			align-items: center;
			padding: 4em 1em;
			font-size: 0.8rem;
		}

		.socialMedia {
			align-items: center;
			justify-content: center;
		}

		.footerRight {
			align-items: center;
			justify-content: center;
			text-align: center;
		}

		.awardImage {
			margin-top: 20px;
		}
	}
</style>
