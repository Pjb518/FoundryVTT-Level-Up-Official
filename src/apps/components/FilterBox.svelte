<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import arraysAreEqual from "../../utils/arraysAreEqual";
    import toggleFilter from "../utils/toggleFilter";
    import MultiStateCheckBoxGroup from "./MultiStateCheckBoxGroup.svelte";

    export let filterSections;
    export let activeFilters;
    export let onUpdateFilters;

    function toggleAll(filters) {
        filters = Object.keys(filters);
        const sectionFilters = activeFilters?.inclusive?.filter((f) =>
            filters.includes(f)
        );

        if (arraysAreEqual(sectionFilters, filters)) {
            const inclusiveFilters = activeFilters?.inclusive?.filter(
                (f) => !filters.includes(f)
            );
            return onUpdateFilters(inclusiveFilters, []);
        }

        const inclusiveFilters = new Set([
            ...filters,
            ...activeFilters?.inclusive,
        ]);

        return onUpdateFilters([...inclusiveFilters], []);
    }

    function updateFilters(newSelections) {
        onUpdateFilters(newSelections[0], newSelections[1]);
    }
</script>

<section class="filter-box">
    {#each filterSections as { label, filters }}
        <div class="filter-box__section">
            <header class="u-align-center u-flex u-gap-lg">
                <h3 class="u-text-sm u-text-bold">
                    {localize(label)}
                </h3>

                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-missing-attribute -->
                <a
                    class="u-text-xs"
                    on:click|stopPropagation={() => toggleAll(filters)}
                >
                    {localize("A5E.ButtonToggleAll")}
                </a>
            </header>

            <ul class="filter-box__filters u-text-xs u-w-full">
                <MultiStateCheckBoxGroup
                    options={Object.entries(filters).map(
                        ([value, { label }]) => [value, label]
                    )}
                    selected={[
                        activeFilters?.inclusive ?? [],
                        activeFilters?.exclusive ?? [],
                    ]}
                    on:updateSelection={({ detail }) => updateFilters(detail)}
                />
            </ul>
        </div>
    {/each}

    <div class="hint">
        Hint: Right-click a filter to quickly remove it from the selection.
    </div>
</section>

<style lang="scss">
    .filter-box {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 0.75rem 0.5rem;

        &__section {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        &__filters {
            display: flex;
            flex-wrap: wrap;
            gap: 0.25rem;
            width: 20rem;
            list-style: none;
            margin: 0;
            padding: 0;
        }
    }

    .hint {
        font-size: 0.694rem;
    }
</style>
