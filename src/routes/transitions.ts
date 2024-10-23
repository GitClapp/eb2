import { crossfade } from 'svelte/transition';
import { quintOut } from 'svelte/easing';

export const [send, receive] = crossfade({
	duration: (d) => Math.sqrt(d * 200),

	fallback(node, params) {
		return {
			duration: 200,
			easing: quintOut,
			css: (t) => `
				transform: scale(${t});
				opacity: ${t}
			`
		};
	}
});