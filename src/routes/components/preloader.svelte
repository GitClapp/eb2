<script lang="ts">
	import { fade } from 'svelte/transition';

	type Animation = 'default' | 'circle' | 'spinner' | 'dots';

	export let style = '';
	export let animation: Animation = 'default';
</script>

<div class="overlay" out:fade={{ delay: 10 }} {style}>
	<slot />

	{#if animation === 'default'}
		<div class="default">
			<div />
			<div />
			<div />
			<div />
		</div>
	{:else if animation === 'spinner'}
		<div class="spinner">
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
		</div>
	{:else if animation === 'circle'}
		<div class="circle"><div /></div>
	{:else if animation === 'dots'}
		<div class="dots">
			<div />
			<div />
			<div />
			<div />
		</div>
	{/if}
</div>

<style>
	.overlay {
		position: fixed;
		top: 0;
		left: 0;

		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		width: 100vw;
		height: 100vh;
		height: 100dvh;
		z-index: 1000;

		background-color: #f27931;
	}

	.default {
		display: inline-block;
		position: relative;
		width: 70px;
		height: 70px;
	}
	.default div {
		box-sizing: border-box;
		display: block;
		position: absolute;
		width: 70px;
		height: 70px;
		margin: 8px;
		border: 8px solid #fff;
		border-radius: 50%;
		animation: default 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
		border-color: #fff transparent transparent transparent;
	}
	.default div:nth-child(1) {
		animation-delay: -0.45s;
	}
	.default div:nth-child(2) {
		animation-delay: -0.3s;
	}
	.default div:nth-child(3) {
		animation-delay: -0.15s;
	}
	@keyframes default {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	.dots {
		position: relative;
		transform: translateX(-6px);
		width: calc(60 / 16 * 1em);
		height: calc(60 / 16 * 1em);
	}
	.dots div {
		position: absolute;
		top: calc(24 / 16 * 1em);
		width: calc(13 / 16 * 1em);
		height: calc(13 / 16 * 1em);
		border-radius: 50%;
		background: #fff;
		animation-timing-function: cubic-bezier(0, 1, 1, 0);
	}
	.dots div:nth-child(1) {
		left: calc(8 / 16 * 1em);
		animation: dots1 0.6s infinite;
	}
	.dots div:nth-child(2) {
		left: calc(8 / 16 * 1em);
		animation: dots2 0.6s infinite;
	}
	.dots div:nth-child(3) {
		left: calc(32 / 16 * 1em);
		animation: dots2 0.6s infinite;
	}
	.dots div:nth-child(4) {
		left: calc(56 / 16 * 1em);
		animation: dots3 0.6s infinite;
	}
	@keyframes dots1 {
		0% {
			transform: scale(0);
		}
		100% {
			transform: scale(1);
		}
	}
	@keyframes dots3 {
		0% {
			transform: scale(1);
		}
		100% {
			transform: scale(0);
		}
	}
	@keyframes dots2 {
		0% {
			transform: translate(0, 0);
		}
		100% {
			transform: translate(calc(24 / 16 * 1em), 0);
		}
	}
	.circle {
		transform: translateZ(calc(1 / 16 * 1em));
	}
	.circle > div {
		display: inline-block;
		width: calc(64 / 16 * 1em);
		height: calc(64 / 16 * 1em);
		margin: calc(8 / 16 * 1em);
		border-radius: 50%;
		background: #fff;
		animation: circle 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite;
	}
	@keyframes circle {
		0%,
		100% {
			animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
		}
		0% {
			transform: rotateY(0deg);
		}
		50% {
			transform: rotateY(1800deg);
			animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1);
		}
		100% {
			transform: rotateY(3600deg);
		}
	}
	.spinner {
		position: relative;
		width: calc(80 / 16 * 1em);
		height: calc(80 / 16 * 1em);
	}
	.spinner div {
		transform-origin: calc(40 / 16 * 1em) calc(40 / 16 * 1em);
		animation: spinner 1.2s linear infinite;
	}
	.spinner div:after {
		content: ' ';
		display: block;
		position: absolute;
		top: calc(3 / 16 * 1em);
		left: calc(37 / 16 * 1em);
		width: calc(6 / 16 * 1em);
		height: calc(18 / 16 * 1em);
		border-radius: 20%;
		background: #fff;
	}
	.spinner div:nth-child(1) {
		transform: rotate(0deg);
		animation-delay: -1.1s;
	}
	.spinner div:nth-child(2) {
		transform: rotate(30deg);
		animation-delay: -1s;
	}
	.spinner div:nth-child(3) {
		transform: rotate(60deg);
		animation-delay: -0.9s;
	}
	.spinner div:nth-child(4) {
		transform: rotate(90deg);
		animation-delay: -0.8s;
	}
	.spinner div:nth-child(5) {
		transform: rotate(120deg);
		animation-delay: -0.7s;
	}
	.spinner div:nth-child(6) {
		transform: rotate(150deg);
		animation-delay: -0.6s;
	}
	.spinner div:nth-child(7) {
		transform: rotate(180deg);
		animation-delay: -0.5s;
	}
	.spinner div:nth-child(8) {
		transform: rotate(210deg);
		animation-delay: -0.4s;
	}
	.spinner div:nth-child(9) {
		transform: rotate(240deg);
		animation-delay: -0.3s;
	}
	.spinner div:nth-child(10) {
		transform: rotate(270deg);
		animation-delay: -0.2s;
	}
	.spinner div:nth-child(11) {
		transform: rotate(300deg);
		animation-delay: -0.1s;
	}
	.spinner div:nth-child(12) {
		transform: rotate(330deg);
		animation-delay: 0s;
	}
	@keyframes spinner {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
</style>
