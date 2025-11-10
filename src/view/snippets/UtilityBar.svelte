<script lang="ts">
    import ActorFilter from "#view/components/ActorFilter.svelte";

    type Props = {
        filterOptions: {
            searchTerm: string;
            searchDescription: boolean;
            page?: string;
        };
        filters?: Record<string, (item: any) => boolean>;
        searchBar?: boolean;
        showAddIcon?: boolean;
        onAddIconClick?: () => void;
        showDescription: boolean;
        showDescriptionButton?: boolean;
        showSearchDescriptionButton?: boolean;
        showFilters?: boolean;
        showSortButton?: boolean;
        sortHandler?: (reverse: boolean) => void;
        children?: () => any;
    };

    let {
        filterOptions = $bindable(),
        searchBar = true,
        showAddIcon: showAddMenu = false,
        onAddIconClick = () => {},
        showDescription = $bindable(),
        showDescriptionButton = false,
        showSearchDescriptionButton = false,
        showFilters = false,
        showSortButton = false,
        sortHandler = () => {},
        children,
    }: Props = $props();
</script>

<section class="a5e-utility-bar">
    <!-- Search Bar -->
    {#if searchBar}
        <div class="a5e-utility-bar__search-container">
            <input
                class="a5e-input a5e-input--slim a5e-utility-bar__search-bar"
                type="text"
                bind:value={filterOptions.searchTerm}
                placeholder={game.i18n.localize("Search ...")}
            />
        </div>
    {/if}

    <!-- Show Description Button -->
    {#if showDescriptionButton}
        <button
            class="a5e-button a5e-button--transparent"
            onclick={() => (showDescription = !showDescription)}
            data-tooltip={showDescription
                ? game.i18n.localize("Hide All Descriptions")
                : game.i18n.localize("Show All Descriptions")}
            data-tooltip-direction="UP"
            aria-label="Toggle Show Description"
        >
            <i class="fa-solid fa-info-circle"></i>
        </button>
    {/if}

    <!-- Sort -->
    {#if showSortButton}
        <button
            class="a5e-button a5e-button--transparent"
            data-tooltip="Sort Alphabetically Ascending"
            data-tooltip-direction="UP"
            aria-label="Sort Alphabetically Ascending"
            onclick={() => sortHandler(false)}
        >
            <i class="fa-solid fa-arrow-down-a-z"></i>
        </button>

        <button
            class="a5e-button a5e-button--transparent"
            data-tooltip="Sort Alphabetically Descending"
            data-tooltip-direction="UP"
            aria-label="Sort Alphabetically Descending"
            onclick={() => sortHandler(true)}
        >
            <i class="fa-solid fa-arrow-down-z-a"></i>
        </button>
    {/if}

    <!-- Filters -->
    {#if showFilters}
        <ActorFilter page={filterOptions.page!} />
    {/if}

    <!-- Add Menu -->
    {#if showAddMenu}
        <button
            class="a5e-button a5e-button--transparent"
            data-tooltip="Add Document"
            data-tooltip-direction="UP"
            aria-label="Add Document"
            onclick={onAddIconClick}
        >
            <i class="fa-solid fa-plus"></i>
        </button>
    {/if}

    <!-- Other -->
    {@render children?.()}
</section>

<style lang="scss">
    .a5e-utility-bar {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding-right: 0.25rem;
        margin-block: 0 0.5rem;
        font-size: var(--a5e-md-text);
        color: var(--a5e-button-gray);

        &__search-container {
            flex-grow: 1;
            font-size: var(--a5e-sm-text);
        }

        &__search-bar {
            border-radius: var(--a5e-border-radius-standard);
        }
    }
</style>
