<script lang="ts">
    import { getContext } from "svelte";

    import { filterItems } from "#utils/view/filterItems.ts";
    import { groupItemsByType } from "#utils/view/groupItemsByType.ts";
    import { usesRequired } from "#utils/view/usesRequired.ts";

    import UtilityBar from "../../snippets/UtilityBar.svelte";
    import ItemCategory from "../components/ItemCategory.svelte";

    let actor: any = getContext("actor");
    let sheetIsLocked: () => boolean = getContext("sheetIsLocked");

    let actorStore = $derived(actor.reactive.system);
    let items = $derived(filterItems(actor.reactive, "feature"));
    let categorizedItems = $derived(groupItemsByType(items, "featureType"));

    const openCompendium = game.a5e.utils.openCompendium;

    let showDescription = $state(false);
    let showFavorPoints =
        (game.settings.get("a5e", "showFavorPoints") as boolean) ?? false;
    let showUses = $derived(usesRequired(items));

    $inspect(items);
</script>

{#if actor.isOwner}
    <!--  -->
    <!-- UtilityBar Goes HEre -->
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
        <ItemCategory
            {showDescription}
            {showUses}
            {items}
            type="featureTypes"
        />
    {/if}
</section>
