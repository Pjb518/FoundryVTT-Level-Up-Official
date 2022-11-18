<script>
	import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
	import { getContext } from 'svelte';
	import { TJSInput } from '@typhonjs-fvtt/svelte-standard/component';
	import { createFilterQuery } from '@typhonjs-fvtt/svelte-standard/store';

	import addReducerFilter from '../utils/addReducerFilter';

	import ItemCategory from './item/ItemCategory.svelte';

	const actor = getContext('actor');
	const { spells } = actor;

	const filterSearch = createFilterQuery('name');
	const input = {
		store: filterSearch,
		placeholder: 'Search...',
		type: 'search',
	};

	addReducerFilter(spells, { id: 'searchFilter', filter: filterSearch });
</script>

<div class="spells-page">
	<header class="search-container">
		<TJSInput {input} />

		<i class="fas fa-sort" />
		<i class="fas fa-filter" />
	</header>

	<section class="spells-main-container">
		{#each Object.entries($spells._levels) as [label, items]}
			{#if items.length}
				<ItemCategory {label} {items} type="spellLevelHeadings" />
			{/if}
		{/each}
	</section>

	<footer class="spells-footer" />
</div>

<style lang="scss">
	.spells-page {
		display: flex;
		flex-direction: column;
		flex: 1;
		gap: 0.5rem;
		overflow: hidden;
	}
	.search-container {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.spells-main-container {
		display: flex;
		flex-grow: 1;
		flex-direction: column;
		gap: 0.25rem;
		overflow-y: auto;
	}
</style>
