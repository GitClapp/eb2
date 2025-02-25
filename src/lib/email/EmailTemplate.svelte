<script lang="ts">
	import * as cheerio from 'cheerio';

	// Dynamic data passed from the server.
	export let fullName: string;
	export let email: string;
	export let phone: string;
	export let country: string;
	export let linkedin: string;
	export let cvFileName: string;
	export let academicLevel: string;
	export let yearsOfExperience: string;
	export let currentField: string;
	export let awards: string;
	export let aiEvaluation: string;

	type Info = {
		icon: string;
		title: string;
		description: string;
	};

	// Helper to extract the suggested email from a text block.
	function extractSuggestedEmail(evaluation: string): string {
		const $ = cheerio.load(evaluation);
		const paragraphs = $('p').toArray();

		// Find the paragraph that contains the header "Sugerencia de Email..." (case-insensitive).
		const headerIndex = paragraphs.findIndex((p) =>
			/Sugerencia\s*de\s+(?:Email|Correo Electr[oó]nico)/i.test($(p).text()),
		);
		if (headerIndex === -1) return '';

		// Look for the first marker ("---") after the header.
		let startMarkerIndex = -1;
		for (let i = headerIndex + 1; i < paragraphs.length; i++) {
			if ($(paragraphs[i]).text().trim() === '---') {
				startMarkerIndex = i;
				break;
			}
		}
		if (startMarkerIndex === -1) return '';

		// The email content starts in the paragraph immediately after the start marker.
		const emailStart = startMarkerIndex + 1;

		// Find the end marker: the next paragraph that contains exactly "---".
		let endMarkerIndex = paragraphs.findIndex(
			(p, i) => i >= emailStart && $(p).text().trim() === '---',
		);
		if (endMarkerIndex === -1) endMarkerIndex = paragraphs.length;

		// Collect and return the HTML of the paragraphs that form the email.
		const emailParagraphs = paragraphs.slice(emailStart, endMarkerIndex);
		return emailParagraphs.map((p) => $.html(p)).join('');
	}

	// Basic info
	const openQuestions: Info[] = [
		{
			icon: 'id',
			title: 'Nombre Completo',
			description: fullName,
		},
		{
			icon: 'email',
			title: 'Correo Electrónico',
			description: email,
		},
		{
			icon: 'phone',
			title: 'Teléfono',
			description: phone,
		},
		{
			icon: 'phone_location',
			title: 'País',
			description: country,
		},
		{
			icon: 'linkedin',
			title: 'LinkedIn',
			description: linkedin,
		},
		{
			icon: 'cv',
			title: 'CV Adjunto',
			description: cvFileName ? cvFileName : 'No se adjuntó un archivo',
		},
	];

	// Career info
	const closedQuestions: Info[] = [
		{
			icon: 'grad',
			title: 'Nivel Académico',
			description: academicLevel,
		},
		{
			icon: 'experience',
			title: 'Años de Experiencia Profesional',
			description: yearsOfExperience,
		},
		{
			icon: 'work',
			title: 'Área o Campo Profesional Actual',
			description: currentField,
		},
		{
			icon: 'award',
			title: 'Reconocimientos o Premios',
			description: awards,
		},
	];

	// AI Evaluation
	const evaluation: Info[] = [
		{
			icon: 'ai',
			title: extractSuggestedEmail(aiEvaluation)
				? 'Correo electrónico sugerido'
				: 'Evaluación de IA',
			description: extractSuggestedEmail(aiEvaluation) || aiEvaluation,
		},
	];
</script>

<div class="container">
	<!-- Basic Information Section -->
	<div class="section">
		<h2>Información Básica de {fullName}</h2>
		<div class="section-content">
			{#each openQuestions as info}
				<div class="card">
					<div class="card-header">
						<img
							src="https://eb2.cantolegal.com/images/svg/{info.icon}.png"
							width="20"
							height="20"
							aria-hidden="true"
							alt={info.title}
						/>
						<h3>{info.title}</h3>
					</div>
					<div class="card-body">
						<p>{info.description || 'No proporcionado'}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Career Information Section -->
	<div class="section">
		<h2>Carrera de {fullName}</h2>
		<div class="section-content">
			{#each closedQuestions as info}
				<div class="card">
					<div class="card-header">
						<img
							src="https://eb2.cantolegal.com/images/svg/{info.icon}.png"
							width="20"
							height="20"
							aria-hidden="true"
							alt={info.title}
						/>
						<h3>{info.title}</h3>
					</div>
					<div class="card-body">
						<p>{info.description || 'No proporcionado'}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- AI Generated Evaluation Section -->
	{#if aiEvaluation}
		<div class="section">
			<h2>Generado por Inteligencia Artificial</h2>
			<div class="section-content">
				{#each evaluation as info}
					<div class="card">
						<div class="card-header">
							<img
								src="https://eb2.cantolegal.com/images/svg/{info.icon}.png"
								width="20"
								height="20"
								aria-hidden="true"
								alt={info.title}
							/>
							<h3>{info.title}</h3>
						</div>
						<div class="card-body">
							<!-- Use @html to render HTML from the AI evaluation safely -->
							<p>{@html info.description}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	/* Container */
	.container {
		margin: 0 auto;
		font-family: Arial, sans-serif;
		font-size: 16px;
		line-height: 1.4;
		color: #111111;
	}

	/* Section */
	.section {
		width: 100%;
		max-width: 700px;
		margin: auto;
		margin-bottom: 2rem;

		border: #00000010 solid 3px;
		border-radius: 20px;
		box-shadow: 0 0 10px #00000010;
		background-color: #ffffff;
		padding: 2rem 2rem 1.5rem;
	}

	.section h2 {
		margin-bottom: 1rem;
		font-size: 24px;
		font-weight: 500;
	}

	.section-content {
		padding-left: 1.5rem;
		border-left: 2px solid #e4dede;
	}

	/* Card */
	.card {
		border-radius: 10px;
		padding: 0 5px;
		padding-bottom: 30px;
		display: grid;
	}

	.card-header {
		display: flex;
		gap: 9px;
		font-size: 15px;
		font-weight: bold;
		color: #c3b4b4;
	}

	.card-header h3 {
		margin: 0;
		font-weight: 600;
		color: #666666;
	}

	.card-body {
		margin-top: 5px;
		padding-left: 5px;
	}

	.card-body p {
		margin: 0;
		font-size: 18px;
		color: #111111;
	}
</style>
