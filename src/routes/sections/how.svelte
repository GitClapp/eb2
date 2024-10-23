<script lang="ts">
	import { baseImageRoute } from '../stores'; // Importing the baseImageRoute
</script>

<div class="howSection">
	<div class="textContainer">
		<h2>¿Cómo podemos ayudarte a obtener la VISA EB-2 NIW?</h2>
		<p>
			En CantoLegal, somos un equipo de expertos en inmigración con amplia experiencia en la
			tramitación de la VISA EB-2 NIW. Te ofrecemos un servicio integral que incluye:
		</p>
		<ul>
			<li>
				<strong>Evaluación gratuita en línea</strong> para determinar si cumples con los requisitos
				de elegibilidad.
			</li>
			<li>Asesoría personalizada sobre tu caso específico.</li>
			<li>Preparación de toda la documentación necesaria.</li>
			<li>Representación ante las autoridades migratorias.</li>
			<li>Seguimiento de tu caso y acompañamiento.</li>
		</ul>
	</div>
	<div class="imageContainer">
		<img src="{baseImageRoute}/how.avif" alt="Engineer working with laptop" />
	</div>
</div>

<style>
	.howSection {
		display: flex;
		gap: 40px;
		padding: 5em 3em;
		align-items: center;
		font-size: 1.5rem;
	}

	.textContainer {
		flex: 1;
	}

	h2 {
		font-size: 1.8em;
		font-weight: bolder;
		text-transform: uppercase;
		margin-bottom: 20px;
	}

	p {
		font-size: 0.9em;
		margin-bottom: 2em;
		line-height: 1.6;
	}

	ul {
		list-style-type: none;
		padding: 0;
	}

	ul li {
		margin-bottom: 15px;
		font-size: 0.9em;
	}

	ul li::before {
		content: '✔';
		color: #f27931;
		margin-right: 10px;
	}

	.imageContainer {
		flex: 1;
	}

	.imageContainer img {
		width: 100%;
		border-radius: 10px;
	}

	@media (max-width: 768px) {
		.howSection {
			padding: 5em 2em;
			font-size: 1rem;
			flex-direction: column;
			text-align: left;
		}

		.imageContainer img {
			width: 100%;
			height: auto;
		}
	}
</style>
