<script lang="ts">
	import { goto } from '$app/navigation';
	import toast from 'svelte-french-toast';
	import PhoneInput from '../components/phoneInput.svelte';
	import { baseImageRoute, baseRoute, email, fullName, phone } from '../stores';

	// Form submit handler
	function handleSubmit() {
		if (!valid && $phone && $phone.length > 0) {
			toast.error('El número telefónico no es valido', {
				style: 'font-size: 1.2em;',
			});
			return;
		}

		$fullName = $fullName?.trim();

		goto(`${baseRoute}/curriculum`);
	}

	let valid: boolean;
</script>

<div class="mainForm" style="background-image: url('{baseImageRoute}/landing.jpg');">
	<!-- Logo -->
	<img src="{baseImageRoute}/logo.avif" alt="Logo" class="logo" />

	<!-- Main Text Section -->
	<div class="mainText">
		<h1>¿ERES UN PROFESIONAL TALENTOSO Y CALIFICADO?</h1>
		<h2>¡Alcanza tu sueño de vivir y trabajar en Estados Unidos con la VISA EB-2 NIW!</h2>
		<p>
			Solicita tu evaluación gratuita en línea y descubre si la VISA EB-2 NIW es la opción
			ideal para ti.
		</p>
		<ul>
			<li>No se requiere patrocinador.</li>
			<li>Posibilidad de traer a tu familia contigo.</li>
			<li>Proceso de solicitud rápido y sencillo.*</li>
			<li>Permite la residencia permanente en Estados Unidos.</li>
			<li>Sin gran inversión económica.</li>
		</ul>
	</div>

	<!-- Form Section -->
	<form id="evaluacion-gratuita" on:submit|preventDefault={handleSubmit} class="evaluationForm">
		<input required type="text" bind:value={$fullName} placeholder="Nombre Completo" />
		<input required type="email" bind:value={$email} placeholder="Correo Electrónico" />
		<PhoneInput bind:value={$phone} bind:valid required={false} />
		<button type="submit">Quiero una evaluación gratuita</button>
	</form>
</div>

<style>
	.mainForm {
		position: relative;
		background-size: cover;
		background-position: center;
		padding: 5rem 50px;
		color: white;
		display: flex;
		flex-direction: column;
		font-size: 1.5rem;
	}

	@media screen and (min-width: 1500px) {
		.mainForm {
			padding: 50px 10em;
		}
	}
	@media screen and (max-width: 750px) {
		.mainForm {
			padding: 30px;
			padding-bottom: 50px;
			font-size: 1rem;

			background-color: #1e202b;
			background-image: none !important;
		}
	}

	.logo {
		width: 7em;
		margin-bottom: 2em;
	}

	.mainText {
		max-width: 600px;
		margin-bottom: 1rem;
	}

	h1,
	h2 {
		margin: 0 0 1rem;
	}

	h1 {
		font-weight: 700;
	}

	h2 {
		font-weight: 500;
	}

	p,
	ul {
		font-weight: 300;
		font-size: 0.9em;
		line-height: 1.5;
	}

	ul {
		list-style-type: none;
		padding: 0;
		margin: 20px 0;
	}

	ul li::before {
		content: '✔';
		color: green;
		margin-right: 10px;
	}

	.evaluationForm {
		display: flex;
		flex-direction: column;
		color: var(--content);
		gap: 15px;
		width: 100%;
		max-width: 500px;
	}

	input {
		padding: 0.75em 1em;
		border: none;
		border-radius: 30px;
		font-size: 0.9em;

		color: var(--content);
		background-color: white;
	}

	button {
		padding: 0.75em 1em;
		background-color: #d32f2f;
		color: white;
		border: none;
		border-radius: 30px;
		font-size: 1em;
		font-weight: 700;
		text-transform: uppercase;
	}

	button:hover {
		background-color: #c62828;
	}
</style>
