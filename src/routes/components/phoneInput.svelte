<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { clickOutsideAction } from 'svelte-tel-input/utils';
	import { TelInput, isSelected, normalizedCountries } from 'svelte-tel-input';
	import type {
		DetailedValue,
		CountrySelectEvents,
		CountryCode,
		E164Number,
		TelInputOptions,
		Country,
	} from 'svelte-tel-input/types';
	import 'svelte-tel-input/styles/flags.css';
	import { slide } from 'svelte/transition';

	export let clickOutside = true;
	export let closeOnClick = true;
	export let disabled = false;
	export let detailedValue: DetailedValue | null = null;
	export let value: E164Number | null;
	export let searchPlaceholder: string | null = 'Buscar...';
	export let selectedCountry: CountryCode | null = 'US';
	export let valid: boolean = true;
	export let required: boolean = true;
	export let options: TelInputOptions = {
		invalidateOnCountryChange: true,
		format: 'national',
	};
	let searchText = '';
	let isOpen = false;

	$: selectedCountryDialCode =
		normalizedCountries.find((el) => el.iso2 === selectedCountry)?.dialCode || null;

	const toggleDropDown = (e?: Event) => {
		e?.preventDefault();
		if (disabled) return;
		isOpen = !isOpen;
	};

	const closeDropdown = (e?: Event) => {
		if (isOpen) {
			e?.preventDefault();
			isOpen = false;
			searchText = '';
		}
	};

	const selectClick = () => {
		if (closeOnClick) closeDropdown();
	};

	const closeOnClickOutside = () => {
		if (clickOutside) {
			closeDropdown();
		}
	};

	const sortCountries = (countries: Country[], text: string) => {
		const normalizedText = text.trim().toLowerCase().replace('+', '');
		if (!normalizedText) {
			return countries.sort((a, b) => a.label.localeCompare(b.label));
		}
		return countries.sort((a, b) => {
			const aNameLower = a.name.toLowerCase();
			const bNameLower = b.name.toLowerCase();
			const aDialCode = String(a.dialCode).toLowerCase();
			const bDialCode = String(b.dialCode).toLowerCase();
			const aStartsWith =
				aNameLower.startsWith(normalizedText) || aDialCode.startsWith(normalizedText);
			const bStartsWith =
				bNameLower.startsWith(normalizedText) || bDialCode.startsWith(normalizedText);
			if (aStartsWith && !bStartsWith) return -1;
			if (!aStartsWith && bStartsWith) return 1;
			const aIndex = aNameLower.indexOf(normalizedText);
			const bIndex = bNameLower.indexOf(normalizedText);
			const aDialIndex = aDialCode.indexOf(normalizedText);
			const bDialIndex = bDialCode.indexOf(normalizedText);
			if (aIndex === -1 && bIndex === -1 && aDialIndex === -1 && bDialIndex === -1)
				return a.id.localeCompare(b.id);
			if (aIndex === -1 && aDialIndex === -1) return 1;
			if (bIndex === -1 && bDialIndex === -1) return -1;
			const aWeight = Math.min(aIndex, aDialIndex) + (aStartsWith ? 0 : 1);
			const bWeight = Math.min(bIndex, bDialIndex) + (bStartsWith ? 0 : 1);
			return aWeight - bWeight;
		});
	};

	const handleSelect = (val: CountryCode, e?: Event) => {
		if (disabled) return;
		e?.preventDefault();
		if (
			selectedCountry === undefined ||
			selectedCountry === null ||
			(typeof selectedCountry === typeof val && selectedCountry !== val)
		) {
			selectedCountry = val;
			onChange(val);
			selectClick();
		} else {
			dispatch('same', { option: val });
			selectClick();
		}
	};

	const dispatch = createEventDispatcher<CountrySelectEvents<CountryCode>>();

	const onChange = (selectedCountry: CountryCode) => {
		dispatch('change', { option: selectedCountry });
	};

	let filterInput: HTMLInputElement;

	function isPrintableKey(key: string) {
		return key === 'Backspace' || (key.length === 1 && key.match(/[\w\s]/)); // Backspace and alphanumeric characters
	}

	function handleKey(event: KeyboardEvent) {
		if (filterInput && document.activeElement !== filterInput && isPrintableKey(event.key)) {
			filterInput.focus();
			if (event.key === 'Backspace') {
				searchText = searchText.slice(0, -1);
			}
		}
	}
</script>

<svelte:window on:keypress={handleKey} />

<div class="outer {!valid && value && value.length > 0 ? `invalid` : ``}">
	<div class="countryControl" use:clickOutsideAction={closeOnClickOutside}>
		<button
			class="selectedCountryButton"
			data-dropdown-toggle="dropdown-states"
			type="button"
			role="combobox"
			aria-controls="dropdown-countries"
			aria-expanded="false"
			aria-haspopup="false"
			on:click={toggleDropDown}
		>
			{#if selectedCountry && selectedCountry !== null}
				<div class="selectedCountry">
					<span class="flag flag-{selectedCountry.toLowerCase()} selectedFlag" />
				</div>
			{:else}
				Escoge un país
			{/if}
			{#if options.format === 'national'}
				<span class="selectedCode">+{selectedCountryDialCode}</span>
			{:else}
				<svg
					aria-hidden="true"
					class="arrow {isOpen ? 'rotate-180' : ''}"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill-rule="evenodd"
						d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			{/if}
		</button>
		{#if isOpen}
			<div
				id="dropdown-countries"
				data-popper-reference-hidden=""
				data-popper-escaped=""
				data-popper-placement="bottom"
				aria-orientation="vertical"
				aria-labelledby="country-button"
				tabindex="-1"
				transition:slide
			>
				<div aria-labelledby="countries-button" role="listbox">
					<input
						class="search"
						aria-autocomplete="list"
						type="text"
						bind:value={searchText}
						bind:this={filterInput}
						placeholder={searchPlaceholder}
					/>
					{#each sortCountries(normalizedCountries, searchText) as country (country.id)}
						{@const isActive = isSelected(country.iso2, selectedCountry)}
						<div id="country-{country.iso2}" role="option" aria-selected={isActive}>
							<button
								value={country.iso2}
								type="button"
								class="countryOption
                            {isActive ? 'activeOption' : ''}"
								on:click={(e) => {
									handleSelect(country.iso2, e);
								}}
							>
								<div class="option">
									<span class="flag flag-{country.iso2.toLowerCase()}" />
									<span class="optionName">{country.name}</span>
									<span
										style="color: var(--content-8); font-size: 0.9em"
										class="optionCode">+{country.dialCode}</span
									>
								</div>
							</button>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>

	<div class="telInput">
		<TelInput
			bind:country={selectedCountry}
			bind:detailedValue
			bind:value
			bind:valid
			{options}
			{required}
		/>
	</div>
</div>

<style>
	/* Wrapper for the phone input to display elements side by side */
	.outer {
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
		border: 1px solid #ccc;
		border-radius: 30px;
		background-color: white;
		font-size: max(16px, 0.85em);
		max-width: calc(100vw - 3rem);
		margin-bottom: 1rem;
	}

	.invalid {
		outline: 1px solid red;
	}

	/* Style for the country selection button to fit with the input */
	.countryControl {
		display: grid;
		align-items: center;
		background-color: #fff;
		border-right: 1px solid #ccc;

		border-top-left-radius: 30px;
		border-bottom-left-radius: 30px;
	}

	/* Style for the phone input to blend with the country selection */
	.selectedCountryButton {
		display: flex;
		gap: 2px;
		align-items: center;
		padding: 0.75rem 0.5rem;
		padding-left: 1.25rem;
		cursor: pointer;
	}

	.selectedCode {
		color: var(--content-8);
		margin: auto 5px;
	}

	.arrow {
		color: #333;
		width: 1.4em;

		transform: rotate(0deg);
		transition: transform 0.2s;
	}

	.rotate-180 {
		transform: rotate(180deg);
	}

	/* TelInput styling to look cohesive with the country selection */
	.telInput {
		flex: 1;
		padding: 0.5em 1em;
		padding-left: 0.75rem;
		border: none;
		color: #333;

		display: grid;
		justify-content: stretch;
		width: fit-content;
	}

	:global(.telInput input) {
		width: 100%;
	}

	/* Dropdown styles for country selection */
	#dropdown-countries {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		margin-top: 8px;
		border-radius: 30px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		background-color: white;
		max-height: 250px;
		overflow-y: auto;
		z-index: 10;
	}

	.search {
		margin-top: 0.5rem;
		padding: 0.75rem 0;
		margin: 0rem 1rem 0.5rem;
		width: calc(100% - 2rem);
		border-bottom: #333 solid 1px;
	}

	.countryOption {
		width: 100%;
	}

	.option {
		display: flex;
		align-items: center;
		padding: 0.5rem 1rem;
		cursor: pointer;
		width: 100%;

		display: flex;
		gap: 0.5em;
	}

	.option:hover {
		background-color: #f0f0f0;
	}

	.optionName {
		max-width: 80%;
		overflow: hidden;
		display: block;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.activeOption {
		background-color: #f0f0f0;
		color: var(--content-7);
	}

	@media screen and (max-width: 750px) {
		.outer,
		#dropdown-countries {
			border-radius: 10px;
		}

		.countryControl {
			border-top-left-radius: 10px;
			border-bottom-left-radius: 10px;
		}

		.telInput {
			padding: 0.5em 0.5em;
		}

		.selectedCountryButton {
			padding: 0.5em 0.25em;
			padding-left: 1rem;
		}
	}
</style>
