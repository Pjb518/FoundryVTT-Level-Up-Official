<script>
    import { getContext } from "svelte";

    import ActorInventoryShields from "../ActorInventoryShields.svelte";
    import ItemCategory from "../ItemCategory.svelte";
    import ItemWeightTrack from "../ItemWeightTrack.svelte";
    import TabFooter from "../TabFooter.svelte";
    import SortFilter from "../SortFilter.svelte";

    const actor = getContext("actor");
    const { objects } = actor;

    $: sortedObjects = Object.entries($objects._types).sort(
        (a, b) => $objects.sortMap?.[a[0]] - $objects.sortMap?.[b[0]]
    );
</script>

<div class="inventory-page">
    {#if $actor.isOwner}
        <SortFilter itemType="objects" />
    {/if}

    <section class="inventory-main-container">
        {#each sortedObjects as [label, items]}
            {#if items.length}
                <ItemCategory {label} {items} type="objectTypesPlural" />
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
