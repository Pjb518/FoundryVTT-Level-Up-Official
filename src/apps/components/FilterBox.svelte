<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import arraysAreEqual from "../../modules/utils/arraysAreEqual";
    import toggleFilter from "../utils/toggleFilter";

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

    function onFilterSelect(filter) {
        const [inclusiveFilters, exclusiveFilters] = toggleFilter(
            activeFilters,
            filter
        );

        onUpdateFilters(inclusiveFilters, exclusiveFilters);
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
                    + Toggle All</a
                >
            </header>

            <ul class="filter-box__filters u-text-xs u-w-full">
                {#each Object.entries(filters) as [value, { label }]}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <li
                        class="a5e-tag a5e-tag--tight u-pointer"
                        class:a5e-tag--red={activeFilters?.exclusive?.includes(
                            value
                        )}
                        class:a5e-tag--inactive={!activeFilters?.inclusive?.includes(
                            value
                        ) && !activeFilters?.exclusive?.includes(value)}
                        on:click|stopPropagation={() => onFilterSelect(value)}
                    >
                        {localize(label)}
                    </li>
                {/each}
            </ul>
        </div>
    {/each}
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

            li:hover {
                background-color: #5c6066;
                // color: black;
                border: 1px solid slategrey;
            }
        }
    }
</style>
