<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { getContext } from "svelte";
    import { TJSInput } from "@typhonjs-fvtt/svelte-standard/component";
    import { createFilterQuery } from "@typhonjs-fvtt/svelte-standard/store";

    import addReducerFilter from "../../utils/addReducerFilter";

    import ItemCategory from "../ItemCategory.svelte";
    import TabFooter from "../TabFooter.svelte";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");
    const { maneuvers } = actor;

    const filterSearch = createFilterQuery("name");
    const input = {
        store: filterSearch,
        placeholder: "Search...",
        type: "search",
    };

    addReducerFilter(maneuvers, { id: "searchFilter", filter: filterSearch });

    $: exertion = $actor.system.attributes.exertion;
    $: sheetIsLocked = $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<div class="maneuvers-page">
    <header class="search-container">
        <TJSInput {input} />

        <i class="fas fa-sort" />
        <i class="fas fa-filter" />
    </header>

    <section class="maneuvers-main-container">
        {#each Object.entries($maneuvers._degrees) as [label, items]}
            {#if items.length}
                <ItemCategory {label} {items} type="maneuverDegrees" />
            {/if}
        {/each}
    </section>

    <TabFooter>
        {#if $actor.type === "character"}
            <div class="u-flex u-align-center u-gap-md">
                <h3 class="u-mb-0 u-text-sm u-text-bold">
                    {localize("A5E.ExertionPool")}
                </h3>

                <input
                    class="a5e-footer-group__input"
                    type="number"
                    name="system.attributes.exertion.current"
                    value={exertion.current}
                    placeholder="0"
                    min="0"
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            Number(target.value)
                        )}
                />
                /
                <input
                    class="a5e-footer-group__input"
                    type="number"
                    name="system.attributes.exertion.max"
                    value={exertion.value}
                    placeholder="0"
                    min="0"
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            Number(target.value)
                        )}
                />
            </div>
        {/if}
        {#if !sheetIsLocked}
            <div class="u-flex u-align-center u-gap-md u-mr-lg">
                <h3 class="u-mb-0 u-text-sm u-text-bold">
                    {localize("A5E.ConfigureManeuvers")}
                </h3>

                <i class="fas fa-gear a5e-config-button" />
            </div>
        {/if}
    </TabFooter>
</div>

<style lang="scss">
    .maneuvers-page {
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

    .maneuvers-main-container {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        gap: 0.25rem;
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>
