<script>
    import { getContext, onDestroy } from "svelte";
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
    import updateFilters from "../utils/updateFilters";

    import FilterBox from "./FilterBox.svelte";

    export let itemType;

    const actor = getContext("actor");
    const reducer = actor[itemType];

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

    $: filters = filterFlag;
</script>

<section class="filters filters__container">
    <div class="search-container">
        <TJSInput input={searchInput} />
    </div>

    <div class="sort-filter__container">
        <TJSIconButton title="Sort" icon="fas fa-sort" />

        <TJSToggleIconButton title="Filters" icon="fas fa-filter">
            <TJSMenu>
                <FilterBox
                    {filterSections}
                    activeFilters={filters}
                    {onUpdateFilters}
                />
            </TJSMenu>
        </TJSToggleIconButton>
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
</style>
