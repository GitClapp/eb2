<script lang="ts">
	import { fade } from 'svelte/transition';

	import MainForm from './sections/mainForm.svelte';
	import Associations from './sections/associations.svelte';
	import Bio from './sections/bio.svelte';
	import Why from './sections/why.svelte';
	import Statistics from './sections/statistics.svelte';
	import How from './sections/how.svelte';
	import Testimonials from './sections/testimonials.svelte';
	import Reviews from './sections/reviews.svelte';
	import Requisites from './sections/requisites.svelte';
</script>

<div in:fade class="eb2">
	<MainForm />
	<Associations />
	<Bio />
	<Why />
	<Statistics />
	<How />
	<Testimonials />
	<Reviews />
	<Requisites />
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
</style>
