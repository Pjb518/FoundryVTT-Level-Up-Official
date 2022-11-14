<script>
	import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
	import { getContext } from 'svelte';
	import Search from 'svelte-search';

	import ItemWrapper from './item/ItemWrapper.svelte';

	const actor = getContext('actor');
	const { objects } = actor;

	let searchTerm = '';
</script>

<header class="search-container">
	<Search
		bind:searchTerm
		hideLabel
		placeholder="Search..."
		on:type={e => {
			console.log(e.detail);
		}}
	/>

	<i class="fas fa-sort" />
	<i class="fas fa-filter" />
</header>

<ul class="items-container">
	{#each [...$objects] as item}
		<ItemWrapper>
			<img class="item-image" src={item.img} alt={item.name} />
			{item.name}
		</ItemWrapper>
	{/each}
</ul>

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

	.item-image {
		height: 1.75rem;
		width: 1.75rem;
		border-radius: 3px;
	}

	.items-container {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0;
		padding-right: 0.375rem;
		margin: 0;
		margin-right: -0.375rem;
		list-style: none;
		overflow-y: auto;
	}
</style>
