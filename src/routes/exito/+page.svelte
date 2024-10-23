<script>
	import { fade } from 'svelte/transition';
	import { baseImageRoute, baseRoute } from '../stores';
</script>

<div class="container" style="background-image: url({baseImageRoute}/backFlag.jpg);" in:fade>
	<div class="card">
		<h1>¡Gracias por contactarnos!</h1>
		<p class="info">
			Nuestro equipo de profesionales expertos en el procesamiento de visas EB-2 NIW estará
			revisando tu información detalladamente y se pondrá en contacto contigo en breve para
			informarte de los resultados de tu evaluación gratuita.
		</p>
		<a href="{baseRoute}/">Volver a la página de inicio</a>

		<h2>¿Cuáles son los siguientes pasos?</h2>
		<p class="steps">
			Nuestro equipo de expertos en inmigración revisará cuidadosamente tu información para
			determinar tu precalificación, la fortaleza de tu caso y ofrecerte recomendaciones
			personalizadas. Te contactaremos por correo electrónico en un plazo de 24 a 48 horas, en
			días laborables, para informarte sobre los resultados.
		</p>
		<p class="steps">
			A partir de ahí, tendrás la oportunidad de agendar una consulta personalizada; un
			consultor experto estará encantado de responder todas tus preguntas, detallarte los
			pasos a seguir y guiarte en el proceso de solicitud de la <i>Green Card EB-2 NIW</i>.
		</p>
		<p class="steps">
			<b> ¡Prepárate para dar el siguiente paso hacia tu futuro en Estados Unidos! </b>
		</p>
	</div>
</div>

<svelte:head>
	<title>Tu información ha sido recibida exitosamente</title>
	<meta name="description" content="" />
</svelte:head>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;

		background-size: cover;
		background-position: top;
	}

	.card {
		background-color: rgb(246, 238, 238); /* Dark blue overlay */
		border-radius: 10px;
		padding: 4rem 30px;
		box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.4);
		max-width: 600px;
		width: 100%;
		text-align: center;
	}

	@media screen and (max-width: 600px) {
		.card {
			text-align: left;
			padding: 4rem 1rem;
			border-radius: 0px;
		}
	}

	h1 {
		font-size: 1.7em;
		margin-bottom: 15px;
	}

	h1,
	h2 {
		text-transform: uppercase;
	}

	a {
		display: inline-block;
		margin-top: 20px;
		padding: 10px 20px;
		background-color: #ff7a00;
		color: white;
		text-decoration: none;
		border-radius: 5px;
		transition: all 0.3s;
		box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.1);
	}

	a:hover {
		filter: saturate(200%);
	}

	h2 {
		font-size: 1.6em;
		margin-top: 40px;
		margin-bottom: 20px;
	}

	p {
		font-size: 1em;
		color: #555;
		margin-bottom: 15px;
		line-height: 1.6;
	}
</style>
