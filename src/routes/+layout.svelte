<script lang="ts">
	import './app.css';
	import { Toaster } from 'svelte-french-toast';
	import { baseImageRoute, language, ready } from './stores';
	import { sleep } from './functions';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Preloader from './components/preloader.svelte';
	import Footer from './sections/footer.svelte';

	let disappearAndAppear: boolean = false;

	$: $language, checkDisappearAndAppear();

	async function checkDisappearAndAppear() {
		disappearAndAppear = false;
		await sleep(1);
		disappearAndAppear = true;
		await sleep(2000);
		disappearAndAppear = false;
	}

	$: $page.url.pathname, goTop();
	let mainContent: HTMLElement;
	let goTop: () => void = () => {};

	onMount(() => {
		$ready = true;

		goTop = () => {
			if (document) {
				document.body.scrollTop = 0;
				document.documentElement.scrollTop = 0;
				mainContent.scrollTop = 0;
			}
		};
	});
</script>

<svelte:head>
	<meta name="author" content="Santiago Ovalles" />
	<link
		rel="icon"
		href="https://cantolegal.com/wp-content/uploads/2019/10/cropped-android-chrome-256x256-32x32.png"
		sizes="32x32"
	/>
	<link
		rel="icon"
		href="https://cantolegal.com/wp-content/uploads/2019/10/cropped-android-chrome-256x256-192x192.png"
		sizes="192x192"
	/>
	<link
		rel="apple-touch-icon"
		href="https://cantolegal.com/wp-content/uploads/2019/10/cropped-android-chrome-256x256-180x180.png"
	/>
</svelte:head>

<Toaster />

<div class:disappearAndAppear>
	<main bind:this={mainContent}>
		<slot />
	</main>

	<Footer />

	{#if !$ready}
		<Preloader animation="default">
			<img
				src="{baseImageRoute}/logo.avif"
				width="200"
				style="margin-bottom: 2rem;"
				alt="Logo"
			/>
		</Preloader>
	{/if}
</div>

<style>
	div {
		min-height: 100%;
		display: grid;
		grid-template-rows: 1fr auto;
		align-items: center;
	}

	main {
		height: 100%;
		z-index: 1;
	}

	.disappearAndAppear {
		animation: disappearAndAppear 1s;
	}

	@keyframes disappearAndAppear {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
