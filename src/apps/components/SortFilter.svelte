<script>
    import { getContext, onDestroy } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import {
        TJSIconButton,
        TJSInput,
        TJSMenu,
        TJSToggleIconButton,
    } from "@typhonjs-fvtt/svelte-standard/component";

    import {
        addSearchFilter,
        removeSearchFilter,
    } from "../handlers/handleSearchFilter";
    import { sortAscending, sortDescending } from "../utils/sortActorItems";
    import updateFilters from "../utils/updateFilters";

    import FilterBox from "./FilterBox.svelte";

    export let itemType;

    const actor = getContext("actor");
    const reducer = actor[itemType];
    const items = [...$reducer];

    // Create Search Filter
    const searchInput = addSearchFilter(reducer);
    onDestroy(() => removeSearchFilter(reducer));

    // Get filterOptions
    const filterSections = Object.values(CONFIG.A5E.filters[itemType]);
    const filterFlag = $actor.getFlag("a5e", `filters.${itemType}`) ?? {};

    // Apply any filters previously applied
    updateFilters(reducer, itemType, filterFlag);

    function onUpdateFilters(inclusiveFilters, exclusiveFilters) {
        $actor.setFlag("a5e", `filters.${itemType}`, {
            inclusive: inclusiveFilters,
            exclusive: exclusiveFilters,
        });

        filters.inclusive = inclusiveFilters;
        filters.exclusive = exclusiveFilters;

        updateFilters(reducer, itemType, filters);
    }

    // Sorting Helpers
    function onSort() {
        // reducer.reversed(true);
        // sortDescending($actor, items);
    }

    $: filters = filterFlag;
</script>

<section class="filters filters__container">
    <div class="search-container">
        <TJSInput input={searchInput} />
    </div>

    <div class="sort-filter__container">
        <button class="sort-filter__button">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <i class="fas fa-sort" on:click={onSort} />
        </button>
        <!-- <TJSIconButton title="Sort" icon="fas fa-sort" /> -->

        <TJSToggleIconButton title="Filters" icon="fas fa-filter">
            <TJSMenu>
                <FilterBox
                    {filterSections}
                    activeFilters={filters}
                    {onUpdateFilters}
                />
            </TJSMenu>
        </TJSToggleIconButton>

        <!-- <button class="sort-filter__button">
            <i class="fas fa-filter" />
            <TJSMenu>
                <FilterBox {filterSections} />
            </TJSMenu>
        </button> -->
    </div>
</section>

<style lang="scss">
    .filters {
        position: relative;
        font-size: 0.833rem;

        &__container {
            display: grid;
            grid-template-areas:
                "search icons"
                "pills  expand";
            grid-template-columns: 1fr 4.5rem;
            gap: 0.275rem;
        }
    }

    .search-container {
        grid-area: search;
    }

    .sort-filter__container {
        grid-area: icons;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .sort-filter__button {
        position: relative;
        width: 1.75rem;
        padding-inline: 0.25rem;
        background: transparent;
        color: rgba(0 0 0 / 0.5);
        transition: all 0.15s ease-in-out;

        &:focus,
        &:hover {
            box-shadow: none;
            transform: scale(1.2);
            color: #555;
        }
    }
</style>
