<script>
    import { getContext } from "svelte";

    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import Filter from "../actorUtilityBar/Filter.svelte";
    import ActorInventoryShields from "../ActorInventoryShields.svelte";
    import ItemCategory from "../ItemCategory.svelte";
    import ItemWeightTrack from "../ItemWeightTrack.svelte";
    import Search from "../actorUtilityBar/Search.svelte";
    import Sort from "../actorUtilityBar/Sort.svelte";
    import TabFooter from "../TabFooter.svelte";
    import UtilityBar from "../actorUtilityBar/UtilityBar.svelte";

    import usesRequired from "../../../utils/usesRequired";
    import quantityRequired from "../../../utils/quantityRequired";

    const actor = getContext("actor");
    const { objects } = actor;
    const { A5E } = CONFIG;

    const sortMap = A5E.reducerSortMap.objects;
    const subTypes = A5E.objectTypes;
    const reducerType = "objects";

    $: menuList = Object.entries(subTypes);
    $: sortedObjects = Object.entries($objects._types).sort(
        (a, b) => sortMap[a[0]] - sortMap[b[0]]
    );
</script>

<div class="inventory-page">
    {#if $actor.isOwner}
        <UtilityBar>
            <Search {reducerType} />
            <Sort {reducerType} />
            <Filter {reducerType} />
            <CreateMenu {reducerType} {menuList} />
        </UtilityBar>
    {/if}

    <section class="inventory-main-container">
        {#each sortedObjects as [label, items]}
            {#if items.length}
                <ItemCategory
                    {label}
                    {items}
                    type="objectTypesPlural"
                    quantityRequired={quantityRequired(objects)}
                    usesRequired={usesRequired(objects)}
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
</div>

<style lang="scss">
    .inventory-page {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 0.5rem;
        overflow: hidden;
    }

    .inventory-main-container {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        gap: 0.75rem;
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>
