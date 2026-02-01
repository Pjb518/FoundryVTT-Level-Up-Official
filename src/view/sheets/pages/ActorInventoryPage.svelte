<script lang="ts">
    import { getContext } from "svelte";

    import { filterItems } from "#utils/view/filterItems.ts";
    import { groupItemsByType } from "#utils/view/groupItemsByType.ts";
    import { usesRequired } from "#utils/view/usesRequired.ts";
    import { quantityRequired } from "#utils/view/quantityRequired.ts";

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
        page: "objects",
    });

    let activeFilters = $derived(
        actor.reactive.flags.a5e?.filters?.objects ?? {
            inclusive: [],
            exclusive: [],
        },
    );

    let filterFunction = $derived.by(() => {
        const { inclusive, exclusive } = activeFilters;

        if (!inclusive.length && !exclusive.length) return undefined;

        return (item: any) => {
            const filterableValues = new Set();

            //Activation Cost
            const actions = Object.values(item.system.actions || {});
            for (const action of actions) {
                const activationType = action.activation?.type;
                if (activationType) filterableValues.add(activationType);
            }

            //Rarity
            const rarity = item.system.rarity;
            if (rarity) filterableValues.add(rarity);

            //Miscellaneous
            if (item.system.attuned) filterableValues.add("attuned");
            if (item.system.bulky) filterableValues.add("bulky");
            if (item.system.equipped) filterableValues.add("equipped");
            if (item.system.plotItem) filterableValues.add("plotItem");
            if (item.system.requiresAttunement)
                filterableValues.add("requiresAttunement");

            for (const value of filterableValues) {
                if (exclusive.includes(value)) return false;
            }

            if (inclusive.length > 0) {
                for (const value of filterableValues) {
                    if (inclusive.includes(value)) return true;
                }

                return false;
            }

            return true;
        };
    });

    let items = $derived(
        filterItems(actor.reactive, "object", {
            searchTerm: filterOptions.searchTerm,
            searchDescription: filterOptions.searchDescription,
            filters: filterFunction,
        }).filter((item) => !item.system.containerId),
    );

    let categorizedItems = $derived(groupItemsByType(items, "objectType"));

    const openCompendium = game.a5e.utils.openCompendium;

    let showDescription = $state(false);
    let showUses = $derived(usesRequired(items));
    let showQuantity = $derived(quantityRequired(items));

    let objectTypes = Object.entries(CONFIG.A5E.objectTypes) as string[][];

    $effect(() => {});
</script>

{#if actor.isOwner}
    <UtilityBar
        bind:filterOptions
        showAddIcon={true}
        addIconOptions={objectTypes}
        showDescriptionButton={true}
        bind:showDescription
        showFilters={true}
        showSortButton={true}
        {sortHandler}
        onAddIconClick={(subType) => createItem(actor, "object", subType)}
    >
        <button
            class="a5e-button a5e-button--transparent"
            data-tooltip="Import Objects from Compendium"
            data-tooltip-direction="UP"
            aria-label="Import Objects from Compendium"
            onclick={() => openCompendium(actor, "objects")}
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
                type="objectTypesPlural"
            />
        {/if}
    {/each}
</section>
