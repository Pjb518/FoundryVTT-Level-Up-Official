<script>
	import { getContext } from 'svelte';
	import { TJSInput } from '@typhonjs-fvtt/svelte-standard/component';
	import { createFilterQuery } from '@typhonjs-fvtt/svelte-standard/store';
	import { rippleFocus } from '@typhonjs-fvtt/svelte-standard/action';

	import addReducerFilter from '../utils/addReducerFilter';

	import InventoryShields from './item/InventoryShields.svelte';
	import ItemCategory from './item/ItemCategory.svelte';
	import WeightTrack from './item/WeightTrack.svelte';

	const actor = getContext('actor');
	const { objects } = actor;

	const filterSearch = createFilterQuery('name');
	const input = {
		store: filterSearch,
		// efx: rippleFocus(),
		placeholder: 'Search...',
		type: 'search',
	};

	addReducerFilter(objects, { id: 'searchFilter', filter: filterSearch });
</script>

<div class="inventory-page">
	<header class="search-container">
		<TJSInput {input} />

		<i class="fas fa-sort" />
		<i class="fas fa-filter" />
	</header>

	<section class="inventory-main-container">
		{#each Object.entries($objects._types) as [label, items]}
			{#if items.length}
				<ItemCategory {label} {items} type="objectTypesPlural" />
			{/if}
		{/each}
	</section>

	<footer class="inventory-footer">
		<div class="u-flex u-flex-col u-gap-md u-w-full">
			<WeightTrack />
		</div>

		<div class="u-flex u-justify-space-between u-w-full">
			<InventoryShields />

			<!-- Currency -->
		</div>
	</footer>
</div>

<style lang="scss">
	.inventory-page {
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

		:global(.tjs-input-container) {
			background-color: #f6f2eb;
			color: #7e7960;

			&:focus,
			&:active {
				background-color: #f6f2eb;
				color: black;
			}
		}
	}

	.inventory-main-container {
		display: flex;
		flex-grow: 1;
		flex-direction: column;
		gap: 0.25rem;
		overflow-y: auto;
	}
</style>
