<script>
    import { getContext, onDestroy } from "svelte";

    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import Filter from "../actorUtilityBar/Filter.svelte";
    import ItemCategory from "../ItemCategory.svelte";
    import Search from "../actorUtilityBar/Search.svelte";
    import ShowDescription from "../actorUtilityBar/ShowDescription.svelte";
    import Sort from "../actorUtilityBar/Sort.svelte";
    import UtilityBar from "../actorUtilityBar/UtilityBar.svelte";

    import usesRequired from "../../../utils/usesRequired";

    const actor = getContext("actor");
    const { features } = actor;
    const { A5E } = CONFIG;

    const reducerType = "features";
    const subTypes = A5E.featureTypes;
    const sortMap = CONFIG.A5E.reducerSortMap.features;

    let showDescription = false;
    let showUses = usesRequired(features);

    $: menuList = Object.entries(subTypes);
    $: sortedFeatures = Object.entries($features._types).sort(
        (a, b) => sortMap[a[0]] - sortMap[b[0]],
    );

    const unsubscribe = features.subscribe((_) => {
        showUses = usesRequired(features);
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

{#if $actor.isOwner}
    <UtilityBar>
        <Search {reducerType} />
        <ShowDescription
            on:updateSelection={() => (showDescription = !showDescription)}
        />
        <Sort {reducerType} />
        <Filter {reducerType} />
        <CreateMenu {reducerType} {menuList} />
    </UtilityBar>
{/if}

<section class="a5e-page-wrapper a5e-page-wrapper--item-list">
    {#if $actor.type === "npc"}
        <ItemCategory
            {showDescription}
            label=""
            items={$features}
            {showUses}
            type="featureTypes"
        />
    {:else}
        {#each sortedFeatures as [label, items]}
            {#if items.length}
                <ItemCategory
                    {label}
                    {items}
                    {showDescription}
                    {showUses}
                    type="featureTypes"
                />
            {/if}
        {/each}
    {/if}
</section>

<footer class="features-footer" />
