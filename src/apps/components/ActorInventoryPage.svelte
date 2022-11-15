<script>
	import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
	import { getContext } from 'svelte';
	import { TJSInput } from '@typhonjs-fvtt/svelte-standard/component';
	import { createFilterQuery } from '@typhonjs-fvtt/svelte-standard/store';
	import { rippleFocus } from '@typhonjs-fvtt/svelte-standard/action';

	import ItemCategory from './item/ItemCategory.svelte';

	const actor = getContext('actor');
	const { objects } = actor;

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
	<TJSInput {input} />

	<i class="fas fa-sort" />
	<i class="fas fa-filter" />
</header>

{#each Object.entries($objects._types) as [label, items]}
	{#if items.length}
		<ItemCategory {label} {items} type="objectTypesPlural" />
	{/if}
{/each}

<style lang="scss">
	.search-container {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
</style>
