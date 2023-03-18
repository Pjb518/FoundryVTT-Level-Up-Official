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

    import { sortAscending, sortDescending } from "../handlers/sortingHandlers";
    import updateFilters from "../utils/updateFilters";

    import FilterBox from "./FilterBox.svelte";

    export let itemType;

    const actor = getContext("actor");
    const reducer = actor[itemType];
    const { A5E } = CONFIG;
    const itemContext = itemType.slice(0, -1);

    // Create Search Filter
    const searchInput = addSearchFilter(reducer);
    onDestroy(() => removeSearchFilter(reducer));

    // Get filterOptions
    const filterSections = Object.values(CONFIG.A5E.filters[itemType]);
    const filterFlag = $actor.getFlag("a5e", `filters.${itemType}`) ?? {};

    // Apply any filters previously applied
    // TODO: Destroy filters on tab change
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

    // +++++++++++++++++++++++++++++++++++++++++++
    // Sorting
    const sortIcons = {
        0: "fa-sort",
        1: "fa-arrow-down-a-z",
        2: "fa-arrow-down-z-a",
    };

    // TODO: Change when custom sort is implemented
    const sortMappings = {
        0: sortAscending,
        1: sortDescending,
        2: sortAscending,
    };

    function onSortReducer() {
        sortMappings[sortMode]($actor, $reducer);

        // TODO: Change when custom sort is implemented
        let newMode = (sortMode + 1) % 3;
        newMode = newMode === 0 ? 1 : newMode;

        $actor.setFlag("a5e", "sortMode", newMode);
    }

    // Add Item Logic
    function createItem() {
        const updateData = {
            name: `New ${itemContext}`,
            type: itemContext,
        };

        $actor.createEmbeddedDocuments("Item", [updateData]);
    }

    let filters = filterFlag;
    let sortMode = $actor.getFlag("a5e", "sortMode") || 0;
</script>

<section class="filters filters__container">
    <div class="search-container">
        <TJSInput input={searchInput} />
    </div>

    <div class="sort-filter__container">
        <TJSIconButton
            title="Sort"
            icon={`fas ${sortIcons[sortMode]}`}
            onPress={onSortReducer}
        />

        <TJSToggleIconButton title="Filters" icon="fas fa-filter">
            <TJSMenu>
                <FilterBox
                    {filterSections}
                    activeFilters={filters}
                    {onUpdateFilters}
                />
            </TJSMenu>
        </TJSToggleIconButton>

        <TJSIconButton
            title={localize("A5E.ButtonAdd", {
                type: localize(A5E.itemTypes[itemContext]),
            })}
            icon="fas fa-plus"
            onPress={() => createItem()}
        />
    </div>
</section>

<style lang="scss">
    :root {
        --tjs-menu-background: url(../ui/denim075.png) repeat;
    }

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
        color: rgba(0 0 0 / 0.2);
    }

    :global {
        .tjs-menu {
            --tjs-menu-background: url("/ui/denim075.png") repeat;
            --tjs-menu-primary-color: #deddd3;
            --tjs-menu-border: 2px solid #555;

            &::before {
                content: "";
                position: absolute;
                width: 100%;
                height: 100%;
                background-color: rgba(0 0 0 / 0.15);
            }
        }

        .tjs-icon-button,
        .tjs-toggle-icon-button {
            --tjs-icon-button-background-hover: none;
            --tjs-icon-button-background-focus: none;
            --tjs-icon-button-background-focus-visible: none;
            --tjs-button-background-selected: none;
            --tjs-icon-button-background-selected: none;
            // --tjs-icon-button-text-shadow-hover: none;
            // --tjs-icon-button-text-shadow-focus: none;
            --tjs-icon-button-transition: all 0.15s ease-in-out;

            i:hover,
            i:focus {
                color: #555;
                transform: scale(1.2);
            }

            a.selected {
                color: #555;
                transform: scale(1.2);

                :hover {
                    transform: none;
                }
            }
        }
    }
</style>
