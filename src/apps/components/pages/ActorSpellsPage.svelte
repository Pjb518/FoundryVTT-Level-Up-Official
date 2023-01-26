<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { getContext } from "svelte";
    import { TJSInput } from "@typhonjs-fvtt/svelte-standard/component";
    import { createFilterQuery } from "@typhonjs-fvtt/svelte-standard/store";

    import addReducerFilter from "../../utils/addReducerFilter";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import ItemCategory from "../ItemCategory.svelte";
    import TabFooter from "../TabFooter.svelte";

    const actor = getContext("actor");
    const { spells } = actor;

    const filterSearch = createFilterQuery("name");
    const input = {
        store: filterSearch,
        placeholder: "Search...",
        type: "search",
    };

    addReducerFilter(spells, { id: "searchFilter", filter: filterSearch });

    $: spellResources = $actor.system.spellResources;
    $: sheetIsLocked = $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<div class="spells-page">
    <header class="search-container">
        <TJSInput {input} />

        <i class="fas fa-sort" />
        <i class="fas fa-filter" />
    </header>

    <section class="spells-main-container">
        {#each Object.entries($spells._levels) as [label, items]}
            {#if items.length}
                <ItemCategory {label} {items} type="spellLevels" />
            {/if}
        {/each}
    </section>

    <TabFooter>
        <!-- Spell Points -->
        <div class="u-flex u-flex-wrap u-align-center u-gap-md">
            <h3 class="u-mb-0 u-text-bold u-text-sm u-flex-grow-1">
                {localize("A5E.SpellPoints")}
            </h3>

            <input
                class="a5e-footer-group__input"
                type="number"
                name="system.spellResources.points.current"
                value={spellResources.points.current}
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
                name="system.spellResources.points.max"
                value={spellResources.points.max}
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

        {#if !sheetIsLocked}
            <div class="u-align-center u-flex u-gap-md u-h-6 u-mr-lg">
                <h3 class="u-mb-0 u-text-bold u-text-sm">
                    {localize("A5E.ConfigureSpells")}
                </h3>

                <i class="fas fa-gear a5e-config-button u-text-sm" />
            </div>
        {/if}
    </TabFooter>
</div>

<style lang="scss">
    .spells-page {
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

    .spells-main-container {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        gap: 0.25rem;
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>
