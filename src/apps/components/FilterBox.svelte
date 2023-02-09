<script>
    import { getContext, onDestroy } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import toggleFilter from "../utils/toggleFilter";

    export let filterSections;
    export let filters;
    export let onUpdateFilters;

    function onFilterSelect(filter) {
        // TODO: Add prevent default
        const [inclusiveFilters, exclusiveFilters] = toggleFilter(
            filters,
            filter
        );

        onUpdateFilters(inclusiveFilters, exclusiveFilters);
    }

    console.log(filters);
</script>

<section class="filter-box">
    {#each filterSections as { label, filters }}
        <div class="filter-box__section">
            <h3 class="u-text-sm u-text-bold">
                {localize(label)}
            </h3>
            <ul class="filter-box__filters u-text-xs u-w-full">
                {#each Object.entries(filters) as [value, { label }]}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <li
                        class="a5e-tag a5e-tag--tight u-pointer"
                        class:a5e-tag--red={filters?.exclusive?.includes(value)}
                        class:a5e-tag--inactive={!filters?.inclusive?.includes(
                            value
                        ) && !filters?.exclusive?.includes(value)}
                        on:click={() => onFilterSelect(value)}
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
        }
    }
</style>
