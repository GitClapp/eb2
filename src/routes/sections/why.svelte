<script lang="ts">
	import { baseImageRoute } from '../stores'; // Importing the baseImageRoute
</script>

<div class="whySection">
	<div class="imageContainer">
		<img src="{baseImageRoute}/why.avif" alt="Scientist working" />
	</div>
	<div class="textContainer">
		<h2>¿Por qué elegir la VISA EB-2?</h2>
		<p>
			La VISA EB-2 NIW, o VISA de Inmigrante de Trabajador Profesional con Exención de Interés
			Nacional, es una categoría de visa que permite a profesionales altamente calificados y
			con habilidades extraordinarias inmigrar a Estados Unidos. Esta visa es ideal para
			individuos que pueden demostrar que su presencia en el país beneficiaría
			significativamente a la economía estadounidense.
		</p>
		<ul>
			<li>Proceso de solicitud relativamente rápido y sencillo.</li>
			<li>No se requiere patrocinador.</li>
			<li>Permite la residencia permanente en Estados Unidos.</li>
			<li>Posibilidad de traer a tu familia contigo.</li>
			<li>Acceso a todos los beneficios de ser residente permanente.</li>
			<li>No requiere de inversión en los Estados Unidos.</li>
		</ul>
	</div>
</div>

<style>
	.whySection {
		display: flex;
		align-items: center;
		gap: 40px;
		background-color: #00133f; /* Dark blue background */
		padding: 5em 2.5em;
		color: white;
		font-size: 1.5rem;
	}

	.imageContainer {
		flex: 1;
	}

	.imageContainer img {
		width: 100%;
		border-radius: 10px;
	}

	.textContainer {
		flex: 1;
		text-align: left;

		display: grid;
		gap: 1rem;
	}

	h2 {
		font-size: 1.5em;
		margin-bottom: 20px;
		text-transform: uppercase;
	}

	p {
		font-size: 0.9em;
		margin-bottom: 20px;
		line-height: 1.6;
	}

	ul {
		list-style-type: none;
		padding: 0;
	}

	ul li {
		margin-bottom: 1em;
		font-size: 0.9em;
	}

	ul li::before {
		content: '✔';
		margin-right: 10px;
		color: orange;
	}

	@media (max-width: 768px) {
		.whySection {
			padding: 5rem 2rem;
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
