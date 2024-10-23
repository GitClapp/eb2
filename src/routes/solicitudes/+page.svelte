<script lang="ts">
	import toast from 'svelte-french-toast';
	import { receive, send } from '../transitions.js';
	import { flip } from 'svelte/animate';

	export let data;
	const solicitudes = data.solicitudes.sort((a, b) => {
		const dateA = new Date(a.date).getTime();
		const dateB = new Date(b.date).getTime();

		// For newest to oldest, we want descending order
		return dateB - dateA;
	});

	let filterText: string;

	// Function to format the current date and time as part of the filename
	const formatDateTime = (format: 'file' | 'human' = 'file', dateString?: string): string => {
		let date: Date;
		if (dateString) {
			date = new Date(dateString);
		} else if (format === 'file') {
			date = new Date();
		} else {
			return '';
		}

		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
		const day = String(date.getDate()).padStart(2, '0');
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');

		if (format === 'file') {
			return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
		} else {
			return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
		}
	};

	// Function to download the Excel file
	const downloadExcel = async () => {
		// Format data
		const filteredData = solicitudes.filter(
			(solicitud) =>
				!filterText ||
				`${solicitud.fullName}${solicitud.email}${solicitud.phone}${solicitud.linkedin}${
					solicitud.academicLevel
				}${solicitud.yearsOfExperience}${solicitud.currentField}${
					solicitud.awards
				}${formatDateTime('human', solicitud.date)}`
					.toLowerCase()
					.includes(filterText.toLowerCase()),
		);

		const formattedData = filteredData.map(
			({
				fullName,
				email,
				phone,
				linkedin,
				date,
				academicLevel,
				yearsOfExperience,
				currentField,
				awards,
			}) => ({
				Nombre: fullName,
				Email: email,
				Teléfono: phone,
				Linkedin: linkedin,
				Nivel_Académico: academicLevel,
				Años_Experiencia: yearsOfExperience,
				Campo_Profesional: currentField,
				Reconocimientos: awards,
				Fecha: formatDateTime('human', date),
			}),
		);

		// Send the data to the API route
		const response = await fetch('/api/excel', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formattedData),
		});

		if (response.ok) {
			// Convert the response to a blob (binary file)
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);

			// Generate the dynamic filename with date and time
			const timestamp = formatDateTime();
			const filename = `solicitudes_${timestamp}.xlsx`;

			// Create an anchor element to download the file
			const a = document.createElement('a');
			a.href = url;
			a.download = filename; // Set the dynamic filename
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		} else {
			toast.error('Ha ocurrido un error descargando los datos.');
		}
	};
</script>

<svelte:head>
	<title>Solicitudes de evaluación de perfil</title>
	<meta name="description" content="" />
</svelte:head>

<div class="solicitudes">
	<h1>Lista de Solicitudes</h1>
	<div class="controls">
		<div class="search-container">
			<ion-icon name="search" />
			<input
				type="text"
				name="filter"
				id="filter"
				bind:value={filterText}
				placeholder="Buscar solicitudes..."
			/>
		</div>
		<button class="download" on:click={downloadExcel}>
			<ion-icon name="download-outline" />
		</button>
	</div>

	<div class="cards">
		{#each solicitudes.filter((solicitud) => !filterText || `${solicitud.fullName}${solicitud.email}${solicitud.phone}${solicitud.linkedin}${solicitud.academicLevel}${solicitud.yearsOfExperience}${solicitud.currentField}${solicitud.awards}${formatDateTime('human', solicitud.date)}`
					.toLowerCase()
					.includes(filterText.toLowerCase())) as solicitud (solicitud.id)}
			<div
				class="solicitudCard"
				in:receive|global={{ key: solicitud.id }}
				out:send|global={{ key: solicitud.id }}
				animate:flip={{ duration: 400 }}
			>
				<div class="solicitudCard-header">
					<h2>{solicitud.fullName}</h2>
				</div>
				<div class="solicitudCard-body">
					<p>
						📧 <strong>Email:</strong>
						{#if solicitud.email}
							<a href="mailto:{solicitud.email}">{solicitud.email}</a>
						{:else}
							<span>No proporcionado.</span>
						{/if}
					</p>
					<p>
						📞 <strong>Teléfono:</strong>
						{#if solicitud.phone}
							<a href="tel:{solicitud.phone}">{solicitud.phone}</a>
						{:else}
							<span>No proporcionado.</span>
						{/if}
					</p>
					<p>
						🔗 <strong>LinkedIn:</strong>
						{#if solicitud.linkedin}
							<a href={solicitud.linkedin} target="_blank">{solicitud.linkedin}</a>
						{:else}
							<span>No proporcionado.</span>
						{/if}
					</p>
					{#if solicitud.academicLevel}
						<p>
							🎓 <strong>Nivel Académico:</strong>
							<span>{solicitud.academicLevel}</span>
						</p>
					{/if}
					{#if solicitud.yearsOfExperience}
						<p>
							📅 <strong>Años de Experiencia:</strong>
							<span>{solicitud.yearsOfExperience}</span>
						</p>
					{/if}
					{#if solicitud.currentField}
						<p>
							💼 <strong>Campo Profesional:</strong>
							<span>{solicitud.currentField}</span>
						</p>
					{/if}
					{#if solicitud.awards}
						<p>
							🏆 <strong>Reconocimientos:</strong>
							<span>{solicitud.awards}</span>
						</p>
					{/if}
					{#if solicitud.date}
						<span class="date">{formatDateTime('human', solicitud.date)}</span>
					{/if}
				</div>
			</div>
		{:else}
			<p>No hay solicitudes para mostrar.</p>
		{/each}
	</div>
</div>

<style>
	.solicitudes {
		padding: 2rem;
		padding-bottom: 3rem;
		min-height: 90vh;
		min-height: 90dvh;
		font-size: 1rem;
	}

	h1 {
		margin-bottom: 2rem;

		text-align: center;
		color: #333;
		font-size: 1.75em;
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		column-gap: 1em;
		row-gap: 0.5em;
		justify-content: end;

		width: fit-content;
		max-width: calc(100vw - 2rem);
		margin: 0 auto 2rem;
	}

	.search-container {
		position: relative;
		width: 400px;
		max-width: 100%;
	}

	.search-container ion-icon {
		position: absolute;
		left: 12px;
		top: 50%;
		transform: translateY(-50%);
		color: #333;
		font-size: 1.2em;
	}

	.search-container input {
		width: 100%;
		padding: 0.5em 1em 0.5em 2.5em;
		border: 1px solid #ccc;
		border-radius: 15px;
		font-size: 1em;
	}

	.search-container input:focus {
		outline: none;
		border-color: #f27931;
	}

	.search-container input::placeholder {
		color: #555;
	}

	.download {
		display: flex;
		justify-content: center;
		align-items: center;

		padding: 0.1em 0.25em;

		color: #555;
		border: 1px solid #ccc;
		border-radius: 0.75em;

		transition: all 0.2s;
	}

	.download:focus-visible,
	.download:hover {
		border-color: #f27931;
		box-shadow: 0 0 5px var(--content-1);
	}

	/* Body */
	.cards {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1.5em;
	}

	.solicitudCard {
		background-color: #fff;
		border-radius: 5px;
		overflow: hidden;
		width: 400px;
		max-width: calc(100vw - 4rem);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s, box-shadow 0.2s;
		display: flex;
		flex-direction: column;
	}

	.solicitudCard:hover {
		transform: translateY(-5px);
		box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
	}

	.solicitudCard-header {
		background-color: #f27931;
		color: #fff;
		padding: 1rem;
	}

	.solicitudCard-header h2 {
		margin: 0;
		font-size: 1.25rem;
	}

	.solicitudCard-body {
		display: flex;
		flex-direction: column;

		padding: 1rem;
		height: 100%;
	}

	.solicitudCard-body p {
		margin: 0.5rem 0;
		color: #555;
	}

	.solicitudCard-body p strong {
		color: #333;
	}

	.date {
		font-size: 0.85em;
		text-align: right;

		margin-top: auto;
		padding-top: 1em;
		color: #666;
	}

	.solicitudCard-body a {
		color: #0077b5;
		text-decoration: none;

		display: block;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		max-width: 100%;
	}

	.solicitudCard-body a:hover {
		text-decoration: underline;
	}

	@media screen and (max-width: 500px) {
		.solicitudes {
			padding: 2rem 1rem 3rem;
		}

		.solicitudCard {
			max-width: calc(100vw - 2rem);
		}
	}

	@media screen and (min-width: 1200px) {
		.solicitudes {
			font-size: 1.2rem;
		}
	}

	@media screen and (min-width: 1500px) {
		.solicitudes {
			font-size: 1.3rem;
		}
	}
</style>
