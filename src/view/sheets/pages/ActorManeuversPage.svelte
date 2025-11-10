<script lang="ts">
    import { getContext } from "svelte";

    import { filterItems } from "#utils/view/filterItems.ts";
    import { groupItemsByType } from "#utils/view/groupItemsByType.ts";
    import { usesRequired } from "#utils/view/usesRequired.ts";
    import { quantityRequired } from "#utils/view/quantityRequired.ts";

    import UtilityBar from "../../snippets/UtilityBar.svelte";
    import ItemCategory from "../components/ItemCategory.svelte";

    function sortHandler(reverse: boolean) {
        sheet._sortEmbeddedAlphabetically(items, "Item", reverse);
    }

    let actor: any = getContext("actor");
    let sheetIsLocked: () => boolean = getContext("sheetIsLocked");

    let filterOptions = $state({
        searchTerm: "",
        searchDescription: false,
        page: "maneuvers",
    });

    let items = $derived(
        filterItems(actor.reactive, "maneuver", filterOptions),
    );
    let categorizedItems = $derived(groupItemsByType(items, "degree"));

    const openCompendium = game.a5e.utils.openCompendium;

    let showDescription = $state(false);
    let showUses = $derived(usesRequired(items));
    let showQuantity = $derived(quantityRequired(items));
</script>

{#if actor.isOwner}
    <UtilityBar
        bind:filterOptions
        showAddIcon={true}
        showDescriptionButton={true}
        showSearchDescriptionButton={true}
        bind:showDescription
        showFilters={true}
        showSortButton={true}
        {sortHandler}
    >
        <button
            class="a5e-button a5e-button--transparent"
            data-tooltip="Import Manuevers from Compendium"
            data-tooltip-direction="UP"
            aria-label="Import Manuevers from Compendium"
            onclick={() => openCompendium(actor, "manuevers")}
        >
            <i class="fa-solid fa-download"></i>
        </button>
    </UtilityBar>
{/if}

<section class="a5e-page-wrapper a5e-page-wrapper--item-list">
    {#each Object.entries(categorizedItems) as [label, itemList]}
        {#if itemList.length > 0}
            <ItemCategory
                {label}
                {showDescription}
                {showQuantity}
                {showUses}
                items={itemList}
                type="maneuverDegrees"
            />
        {/if}
    {/each}
</section>
