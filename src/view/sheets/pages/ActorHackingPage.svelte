<script lang="ts">
    import { getContext } from "svelte";

    import { filterItems } from "#utils/view/filterItems.ts";
    import { usesRequired } from "#utils/view/usesRequired.ts";
    import { localize } from "#utils/localization/localize.ts";

    import UtilityBar from "../../snippets/UtilityBar.svelte";
    import ItemCategory from "../components/ItemCategory.svelte";
    import createItem from "#utils/createItem.ts";

    function sortHandler(reverse: boolean) {
        sheet._sortEmbeddedAlphabetically(items, "Item", reverse);
    }

    let actor: any = getContext("actor");
    let sheet: any = getContext("sheet");

    let filterOptions = $state({
        searchTerm: "",
        searchDescription: false,
        page: "hacking",
    });

    let items = $derived(
        filterItems(actor.reactive, "hacking", {
            searchTerm: filterOptions.searchTerm,
            searchDescription: filterOptions.searchDescription,
        }),
    );

    let showDescription = $state(false);
    let showUses = $derived(usesRequired(items));
</script>

{#if actor.isOwner}
    <UtilityBar
        bind:filterOptions
        showAddIcon={true}
        showDescriptionButton={true}
        showSearchDescriptionButton={true}
        bind:showDescription
        showFilters={false}
        showSortButton={true}
        {sortHandler}
        onAddIconClick={() => createItem(actor, "hacking")}
    />
{/if}

<section class="a5e-page-wrapper a5e-page-wrapper--item-list">
    <ItemCategory
        label={localize("A5E.hacking.tab")}
        {items}
        {showDescription}
        {showUses}
        type="hacking"
    />
</section>
