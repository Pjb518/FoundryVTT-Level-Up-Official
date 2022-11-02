<script>
	import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
	import { getContext } from 'svelte';

	import ResourceTrack from './actor/ResourceTrack.svelte';
	import ItemWrapper from './item/ItemWrapper.svelte';

	export let resources;

	const actor = getContext('actor');
	const { favorites } = actor;

	$: resources = $actor.system.resources;
</script>

<header class="section-header">
	<i class="fas fa-star heading-icon" />

	<h3>
		{localize('A5E.Resources')}
	</h3>
</header>

<ul class="resources-container">
	{#each Object.entries(resources) as [source, resource]}
		<ResourceTrack {resource} {source} />
	{/each}
</ul>

<header class="section-header">
	<i class="fas fa-star heading-icon" />

	<h3>
		{localize('A5E.FavoriteItems')}
	</h3>
</header>

<ul class="items-container">
	{#each [...$favorites] as item}
		<ItemWrapper>
			<img class="item-image" src={item.img} alt={item.name} />
			{item.name}
		</ItemWrapper>
	{/each}
</ul>

<style lang="scss">
	.heading-icon {
		font-size: 0.833rem;
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

	.section-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.25rem;
		padding-top: 0;
		border-bottom: 1px solid #ccc;
		font-size: 1rem;
		font-family: 'Modesto Condensed', serif;
	}

	.resources-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(6rem, 1fr));
		gap: 0.5rem;
		width: 100%;
		align-items: center;
		margin: 0;
		padding: 0;
	}
</style>
