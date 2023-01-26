<script>
    import { getContext } from "svelte";
    import { TJSInput } from "@typhonjs-fvtt/svelte-standard/component";
    import { createFilterQuery } from "@typhonjs-fvtt/svelte-standard/store";
    import { rippleFocus } from "@typhonjs-fvtt/svelte-standard/action";

    import addReducerFilter from "../../utils/addReducerFilter";

    import ActorInventoryShields from "../ActorInventoryShields.svelte";
    import ItemCategory from "../ItemCategory.svelte";
    import ItemWeightTrack from "../ItemWeightTrack.svelte";
    import TabFooter from "../TabFooter.svelte";
    import SortFilter from "../SortFilter.svelte";
    import CheckboxGroup from "../CheckboxGroup.svelte";

    const actor = getContext("actor");
    const { objects } = actor;

    const filterSearch = createFilterQuery("name");
    const input = {
        store: filterSearch,
        // efx: rippleFocus(),
        placeholder: "Search...",
        type: "search",
    };

    addReducerFilter(objects, { id: "searchFilter", filter: filterSearch });
</script>

<div class="inventory-page">
    <header class="search-container">
        <TJSInput {input} />

        <SortFilter />
    </header>

    <section class="inventory-main-container">
        {#each Object.entries($objects._types) as [label, items]}
            {#if items.length}
                <ItemCategory {label} {items} type="objectTypesPlural" />
            {/if}
        {/each}
    </section>

    <TabFooter>
        <ItemWeightTrack />

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
        overflow-x: hidden;
    }
</style>
