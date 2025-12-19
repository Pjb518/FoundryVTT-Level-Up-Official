<script lang="ts">
    import { getContext } from "svelte";

    import { filterItems } from "#utils/view/filterItems.ts";
    import { groupItemsByType } from "#utils/view/groupItemsByType.ts";
    import { usesRequired } from "#utils/view/usesRequired.ts";

    import UtilityBar from "../../snippets/UtilityBar.svelte";
    import ItemCategory from "../components/ItemCategory.svelte";
    import createItem from "#utils/createItem.ts";

    function sortHandler(reverse: boolean) {
        sheet._sortEmbeddedAlphabetically(items, "Item", reverse);
    }

    let actor: any = getContext("actor");
    let sheet: any = getContext("sheet");
    let sheetIsLocked: () => boolean = getContext("sheetIsLocked");

    let filterOptions = $state({
        searchTerm: "",
        searchDescription: false,
        page: "features",
    });

    let actorStore = $derived(actor.reactive.system);
    let items = $derived(filterItems(actor.reactive, "feature", filterOptions));
    let categorizedItems = $derived(groupItemsByType(items, "featureType"));

    const openCompendium = game.a5e.utils.openCompendium;

    let showDescription = $derived(filterOptions.showDescription);
    let showFavorPoints =
        (game.settings.get("a5e", "showFavorPoints") as boolean) ?? false;
    let showUses = $derived(usesRequired(items));

    let featureTypes = Object.entries(CONFIG.A5E.featureTypes) as string[][];
</script>

{#if actor.isOwner}
    <!--  -->
    <UtilityBar
        bind:filterOptions
        showAddIcon={true}
        addIconOptions={featureTypes}
        showSearchDescriptionButton={true}
        showDescriptionButton={true}
        bind:showDescription
        showFilters={true}
        showSortButton={true}
        {sortHandler}
        onAddIconClick={(subType) => createItem(actor, "feature", subType)}
    />
{/if}

<section class="a5e-page-wrapper a5e-page-wrapper--item-list">
    {#if actor.type === "character"}
        {#each Object.entries(categorizedItems) as [label, itemList]}
            <ItemCategory
                {label}
                {showDescription}
                {showUses}
                items={itemList}
                type="featureTypes"
            />
        {/each}
    {:else}
        <ItemCategory {showDescription} {showUses} {items} type="featureTypes" />
    {/if}
</section>
