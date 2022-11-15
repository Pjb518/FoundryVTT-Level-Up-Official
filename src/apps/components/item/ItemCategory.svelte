<script>
	import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

	import ItemWrapper from './ItemWrapper.svelte';

	export let label;
	export let items;
</script>

<section class="category-container">
	<!-- svelte-ignore missing-declaration -->
	<h3 class="category-header">{localize(CONFIG.A5E.objectTypes[label])}</h3>

	<ul class="items-container">
		{#each [...items] as item}
			<ItemWrapper>
				<img class="item-image" src={item.img} alt={item.name} />
				{item.name}
			</ItemWrapper>
		{/each}
	</ul>
</section>

<style lang="scss">
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
