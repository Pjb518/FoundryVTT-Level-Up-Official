<script>
	import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
	import { createFilterQuery } from '@typhonjs-fvtt/svelte-standard/store';
	import { rippleFocus } from '@typhonjs-fvtt/svelte-standard/action';
	import { TJSInput } from '@typhonjs-fvtt/svelte-standard/component';
	import { getContext } from 'svelte';
	import Search from 'svelte-search';

	import ItemCategory from './item/ItemCategory.svelte';

	const actor = getContext('actor');
	const { objects } = actor;
	const { _types } = objects;

	console.log(objects);

	let searchTerm = '';

	const filterSearch = createFilterQuery('name');
	const input = {
		store: filterSearch,
		efx: rippleFocus(),
		placeholder: 'Search...',
		type: 'search',
	};
	objects.filters.add(filterSearch);
</script>

<header class="search-container">
	<!-- <Search
		bind:searchTerm
		hideLabel
		placeholder="Search..."
		on:type={e => {
			console.log(e.detail);
		}}
	/> -->
	<TJSInput {input} />

	<i class="fas fa-sort" />
	<i class="fas fa-filter" />
</header>

{#each Object.entries($_types) as [label, items]}
	<!-- svelte-ignore missing-declaration -->
	{#if items.length}
		<ItemCategory {label} {items} />
	{/if}
{/each}

<style lang="scss">
	.search-container {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	// TODO: Move this to global styles
	:global([data-svelte-search]) {
		flex-grow: 1;
	}

	:global([data-svelte-search] input) {
		background-color: #f6f2eb;
		color: #7e7960;
		box-shadow: 0 0 5px #ccc inset;
		border-radius: 4px;
	}
</style>
