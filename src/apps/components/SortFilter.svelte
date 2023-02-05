<script>
    import { getContext, onDestroy } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSInput } from "@typhonjs-fvtt/svelte-standard/component";

    import {
        addSearchFilter,
        removeSearchFilter,
    } from "../handlers/handleSearchFilter";

    export let itemType;

    const actor = getContext("actor");
    const reducer = actor[itemType];

    // Create Search Filter
    const searchInput = addSearchFilter(reducer);
    onDestroy(() => removeSearchFilter(reducer));

    // Get filterOptions
    const filterOptions = [["concentration", "Concentration"]];
</script>

<section class="filters filters__container">
    <div class="search-container">
        <TJSInput input={searchInput} />
    </div>

    <div class="sort-filter__container">
        <button class="sort-filter__button">
            <i class="fas fa-sort" />
        </button>

        <button class="sort-filter__button">
            <i class="fas fa-filter" />
        </button>
    </div>

    <div class="filter-pills__container">
        <ul
            class="u-flex u-flex-wrap u-gap-sm u-list-style-none u-m-0 u-p-0 u-text-xs u-w-full"
        >
            {#each filterOptions as [value, label]}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <li
                    class="a5e-tag u-pointer"
                    class:a5e-tag--inactive={true}
                    on:click={null}
                >
                    {localize(label)}
                </li>
            {/each}
        </ul>

        {#if filterOptions.length > 5}
            <a class="filter-pills__expand-button"> Expand </a>
        {/if}
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

    .filter-pills {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;

        &__expand-button {
            display: flex;
            justify-content: center;
            align-items: center;
            grid-area: expand;
            border: 1px solid #ccc;
            border-radius: 4px;
            color: black;
            font-size: 0.694rem;
        }
    }
</style>
