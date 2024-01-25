<script>
    import { getContext, onDestroy } from "svelte";

    import ItemCompendiumSheet from "../../ItemCompendiumSheet";

    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import Filter from "../actorUtilityBar/Filter.svelte";
    import ActorInventoryShields from "../ActorInventoryShields.svelte";
    import ItemCategory from "../ItemCategory.svelte";
    import ItemWeightTrack from "../ItemWeightTrack.svelte";
    import Search from "../actorUtilityBar/Search.svelte";
    import ShowDescription from "../actorUtilityBar/ShowDescription.svelte";
    import Sort from "../actorUtilityBar/Sort.svelte";
    import TabFooter from "../TabFooter.svelte";
    import UtilityBar from "../actorUtilityBar/UtilityBar.svelte";

    import usesRequired from "../../../utils/usesRequired";
    import quantityRequired from "../../../utils/quantityRequired";

    function openCompendium() {
        const pack = new ItemCompendiumSheet(
            { collection: game.packs.get("a5e.a5e-adventuring-gear") },
            {
                importer: (docs) => {
                    $actor.createEmbeddedDocuments("Item", docs);
                },
            },
        );

        pack.render(true);
    }

    const actor = getContext("actor");
    const { objects } = actor;
    const { A5E } = CONFIG;

    const sortMap = A5E.reducerSortMap.objects;
    const subTypes = A5E.objectTypes;
    const reducerType = "objects";

    let showDescription = false;
    let showUses = usesRequired(objects);
    let showQuantity = quantityRequired(objects);

    $: menuList = Object.entries(subTypes);
    $: sortedObjects = Object.entries($objects._types).sort(
        (a, b) => sortMap[a[0]] - sortMap[b[0]],
    );

    const unsubscribe = objects.subscribe((_) => {
        showUses = usesRequired(objects);
        showQuantity = quantityRequired(objects);
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

        <button
            class="a5e-import-from-compendium-button fa-solid fa-download"
            on:click={openCompendium}
            data-tooltip="Import Items from Compendium"
            data-tooltip-direction="UP"
        ></button>
    </UtilityBar>
{/if}

<section class="a5e-page-wrapper a5e-page-wrapper--item-list">
    {#each sortedObjects as [label, items]}
        {#if items.length}
            <ItemCategory
                {label}
                {items}
                {showDescription}
                {showQuantity}
                {showUses}
                type="objectTypesPlural"
            />
        {/if}
    {/each}
</section>

<TabFooter>
    {#if $actor.flags?.a5e?.trackInventoryWeight ?? true}
        <ItemWeightTrack />
    {/if}

    <ActorInventoryShields />
</TabFooter>
