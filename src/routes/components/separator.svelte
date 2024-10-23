<script lang="ts">
	export let width: string = '10px';
	export let height: string = '10px';
	export let maxWidth: string = '';
	export let maxHeight: string = '';
	export let margin: string = '0 0';
	export let color: string = 'var(--content)';
	export let borderRadius: string = '50px';
</script>

<div
	style="height: {height}; width: {width}; max-height: {maxHeight}; max-width: {maxWidth}; background-color: {color}; margin: {margin}; border-radius: {borderRadius}"
/>
