<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	import { goto } from '$app/navigation';
	import toast from 'svelte-french-toast';
	import PhoneInput from './components/phoneInput.svelte';
	import { baseImageRoute, baseRoute, email, fullName, phone, ready } from './stores';
	import { browser } from '$app/environment';
	import Separator from './components/separator.svelte';
	import type { CountryCode } from 'svelte-tel-input/types';
	import { normalizedCountries } from 'svelte-tel-input';

	let valid: boolean;
	let countryName: string | undefined;
	let selectedCountry: CountryCode | null | undefined;
	$: selectedCountry,
		selectedCountry
			? (countryName = normalizedCountries.find((el) => el.iso2 === selectedCountry)?.name)
			: (countryName = '');

	let fileInput: HTMLInputElement;
	let fileName: string;
	let cvLabel: HTMLLabelElement;
	let linkedinURL = '';

	export let form: HTMLFormElement;
	$: form, feedbackMessage();

	let isSubmitting = false;

	let academicLevel: string = '';
	let yearsOfExperience: string = '';
	let currentField: string = '';
	let awards: string = '';

	// Function to update the label when a file is selected
	function updateLabel() {
		if (fileInput && fileInput.files?.length && fileInput.files?.length > 0) {
			const file = fileInput.files[0];
			fileName = file.name;
			const fileSize = (file.size / 1024).toFixed(2); // File size in KB
			if (cvLabel) {
				cvLabel.textContent = `${fileName} (${fileSize} KB)`;
			}
		}
	}

	// After the component is mounted, set up event listeners
	$: if (fileInput) {
		fileInput.addEventListener('change', updateLabel);
	}

	function deleteFile() {
		if (fileInput) {
			fileInput.value = ''; // Clear the file input
			fileName = '';
			if (cvLabel) {
				cvLabel.textContent = 'Haz clic aquí para seleccionar un archivo'; // Reset the label text
			}
		}
	}

	function feedbackMessage() {
		$ready = true;
		if (form?.success) {
			deleteFile();
			toast.success('Solicitud enviada correctamente.', { style: 'font-size: 1.2em;' });
			if (browser) {
				goto(`${baseRoute}/exito`);
			}
		} else if (form?.error && isSubmitting) {
			toast.error('La solicitud no ha podido ser enviada. Intenta más tarde.', {
				style: 'font-size: 1.2em;',
			});
		}

		isSubmitting = false;
	}

	function submitForm(target: EventTarget) {
		(target as HTMLFormElement).submit(); // Submit the form
	}
</script>

<div in:fade class="eb2">
	<div class="mainForm" style="background-image: url('{baseImageRoute}/landing.jpg');">
		<!-- Logo -->
		<img src="{baseImageRoute}/logo.avif" alt="Logo" class="logo" />

		<!-- Main Text Section -->
		<div class="mainText">
			<h1>¿ERES UN PROFESIONAL TALENTOSO Y CALIFICADO?</h1>
			<h2>¡Alcanza tu sueño de vivir y trabajar en Estados Unidos con la VISA EB-2 NIW!</h2>
		</div>

		<!-- Form Section -->
		<form
			method="post"
			enctype="multipart/form-data"
			on:submit|preventDefault={(event) => {
				$fullName = $fullName?.trim();
				$email = $email?.trim();

				if (!valid && $phone && $phone.length > 0) {
					toast.error('El número telefónico no es válido', {
						style: 'font-size: 1.2em;',
					});
				} else if (
					(!fileInput || !fileInput.files?.length) &&
					(!academicLevel || !yearsOfExperience || !currentField || !awards)
				) {
					toast.error(
						'Por favor, ingresa un archivo CV o completa los campos de opción múltiple.',
						{
							style: 'font-size: 1.2em;',
						},
					);
				} else {
					toast('Esto puede tomar un momento. Por favor, sé paciente.', {
						style: 'font-size: 1.2em;',
					});
					isSubmitting = true;
					$ready = false;
					if (event.target) {
						submitForm(event.target);
					}
				}
			}}
		>
			<div class="redundantInfo hide">
				<input type="tel" bind:value={$phone} placeholder="Teléfono" name="phone" />
				<input type="text" bind:value={countryName} placeholder="Country" name="country" />
			</div>

			<label for="fullName"><span style="color: #ff4444;">*</span> Nombre Completo:</label>
			<input
				required
				name="fullName"
				id="fullName"
				type="text"
				bind:value={$fullName}
				placeholder="Ingresa tu nombre completo"
			/>

			<label for="email"><span style="color: #ff4444;">*</span> Correo Electrónico:</label>
			<input
				required
				name="email"
				id="email"
				type="email"
				bind:value={$email}
				placeholder="Ingresa tu correo electrónico"
			/>

			<label for="phone"><span style="color: #ff4444;">*</span> Teléfono:</label>
			<PhoneInput bind:selectedCountry bind:value={$phone} bind:valid required={true} />

			<div
				class="noCurriculum"
				transition:slide
				style="padding-top: 1rem; margin-bottom: -1rem;"
			>
				<Separator width="100%" margin="0 0 2rem" color="#fff" height="1px" />

				<!-- Nivel Académico -->
				<label for="academicLevel">Nivel Académico:</label>
				<select
					style="color: {academicLevel ? 'inherit' : '#707072'}"
					id="academicLevel"
					name="academicLevel"
					bind:value={academicLevel}
				>
					<option value="" disabled selected>Selecciona tu nivel académico</option>
					<option>Doctorado (PhD)</option>
					<option>Maestría</option>
					<option>Postgrado / Especialización</option>
					<option>Licenciatura (Grado Universitario de 4 años)</option>
					<option>Técnico Superior Universitario (TSU)</option>
					<option>Bachillerato / Preparatoria</option>
					<option>Carrera Universitaria Incompleta</option>
				</select>

				<!-- Años de Experiencia Profesional -->
				<label for="yearsOfExperience">Años de Experiencia Profesional:</label>
				<select
					style="color: {yearsOfExperience ? 'inherit' : '#707072'}"
					id="yearsOfExperience"
					name="yearsOfExperience"
					bind:value={yearsOfExperience}
				>
					<option value="" disabled selected>Selecciona tus años de experiencia</option>
					<option>Menos de 5 años</option>
					<option>5-10 años</option>
					<option>11-15 años</option>
					<option>16-20 años</option>
					<option>Más de 20 años</option>
				</select>

				<!-- Área o Campo Profesional Actual -->
				<label for="currentField">Área o Campo Profesional Actual:</label>
				<select
					style="color: {currentField ? 'inherit' : '#707072'}"
					id="currentField"
					name="currentField"
					bind:value={currentField}
				>
					<option value="" disabled selected>Selecciona tu área profesional</option>
					<option>Ciencias de la Salud (Médico, Enfermería, Biotecnología)</option>
					<option
						>Ingeniería y Tecnología (Ingeniería Civil, Eléctrica, Informática)</option
					>
					<option>Ciencias Exactas (Matemáticas, Física, Química)</option>
					<option>Negocios y Finanzas (Administración, Contaduría, Economía)</option>
					<option>Derecho y Ciencias Políticas</option>
					<option>Educación y Formación</option>
					<option>Agricultura y Recursos Naturales</option>
					<option>Tecnología de la Información (TI) y Ciberseguridad</option>
					<option>Logística y Cadena de Suministro</option>
				</select>

				<!-- Reconocimiento o Premio Profesional -->
				<label for="awards"
					>¿Has recibido algún reconocimiento o premio profesional en tu campo?</label
				>
				<select
					style="color: {awards ? 'inherit' : '#707072'}"
					id="awards"
					name="awards"
					bind:value={awards}
				>
					<option value="" disabled selected>Selecciona una opción</option>
					<option>Sí, a nivel nacional o internacional</option>
					<option>Sí, a nivel local o dentro de la empresa</option>
					<option>No, pero he tenido logros significativos en mi trabajo</option>
					<option>No</option>
				</select>
			</div>

			<Separator width="100%" margin="2em 0 1.5em" color="#fff" height="1px" />

			<div style="display: inherit;" transition:slide>
				<!-- CV -->
				<label for="cv">Currículum (opcional):</label>
				<label
					bind:this={cvLabel}
					style="color: {fileName ? '#1e202b' : ''};"
					id="cv-label"
					for="cv"
				>
					<span> Haz clic aquí para seleccionar un archivo...</span>
				</label>
				{#if fileName}
					<button on:click={deleteFile} class="deleteFile"
						><ion-icon name="close-outline" /></button
					>
				{/if}
				<input
					bind:this={fileInput}
					type="file"
					id="cv"
					accept=".doc,.docx,.pdf,.jpg,.png"
					style="display: none;"
					name="cv"
				/>
			</div>

			<!-- Linkedin -->
			<label for="linkedin">Enlace de perfil de Linkedin (opcional):</label>
			<input
				type="url"
				id="linkedin"
				name="linkedin"
				bind:value={linkedinURL}
				placeholder="Ingresa tu URL de LinkedIn"
			/>

			<button type="submit" class="submitButton" disabled={isSubmitting}>
				{#if isSubmitting}
					Enviando...
				{:else}
					Quiero una evaluación gratuita
				{/if}
			</button>
		</form>
	</div>
</div>

<svelte:head>
	<title>Cantolegal - Visas de Trabajo</title>
	<meta name="description" content="" />
</svelte:head>

<style>
	.eb2 {
		position: relative;

		display: flex;
		flex-direction: column;

		width: 100%;
		height: 100%;
	}

	.mainForm {
		position: relative;
		background-size: cover;
		background-position: center;
		padding: 5rem 50px 6rem;
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

	form {
		display: grid;
		max-width: 550px;
		color: #1e202b;
	}

	label {
		font-weight: 600;
		margin-bottom: 0.5rem;
		font-size: max(14px, 0.8em);
		color: white;
	}

	input:not([type='checkbox']),
	select,
	#cv-label {
		border: 1px solid #ccc;
		border-radius: 30px !important;
		background-color: white;
		font-size: max(16px, 0.85em);
		width: 100%;
		max-width: calc(100vw - 3rem);
		padding: 0.5em 1em;
		margin-bottom: 1rem;
	}

	select {
		margin-top: 0.5rem;
	}

	#cv-label,
	select {
		color: #707072;
		font-weight: normal;
	}

	/* Delete file button */
	.deleteFile {
		display: flex;
		justify-content: center;
		align-items: center;

		width: fit-content;
		height: fit-content;

		background-color: rgba(228, 9, 9, 0.8);
		color: white;
		border-radius: 50%;
		aspect-ratio: 1 / 1;

		margin-top: -2em;
		margin-left: auto;
		transform: translate(-0.5em, -30%);

		font-size: 1em;

		cursor: pointer;
		z-index: 1;
	}

	/* Submit button styling */
	.submitButton {
		width: 100%;
		padding: 0.75em 1em;
		background-color: #d32f2f;
		color: #fff;
		font-size: max(14px, 0.85em);
		font-weight: bold;
		border: none;
		border-radius: 30px;
		cursor: pointer;
		margin-top: 1.5em;
	}

	.submitButton:hover {
		background-color: #d10a0a;
	}

	@media screen and (max-width: 750px) {
		.deleteFile {
			transform: translate(-0.5em, -55%);
		}

		input:not([type='checkbox']),
		select,
		#cv-label {
			padding: 0.5em 0.75em;
			border-radius: 10px !important;
		}

		.submitButton {
			border-radius: 10px;
		}
	}
</style>
