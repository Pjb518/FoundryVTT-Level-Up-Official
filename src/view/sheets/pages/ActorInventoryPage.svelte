<script lang="ts">
    import { getContext } from "svelte";

    import { filterItems } from "#utils/view/filterItems.ts";
    import { groupItemsByType } from "#utils/view/groupItemsByType.ts";
    import { usesRequired } from "#utils/view/usesRequired.ts";
    import { quantityRequired } from "#utils/view/quantityRequired.ts";

    import UtilityBar from "../snippets/UtilityBar.svelte";
    import ItemCategory from "../components/ItemCategory.svelte";

    let actor: any = getContext("actor");
    let sheetIsLocked: () => boolean = getContext("sheetIsLocked");

    let actorStore = $derived(actor.reactive.system);
    let items = $derived(filterItems(actor.reactive, "object"));
    let categorizedItems = $derived(groupItemsByType(items, "objectType"));

    let showDescription = $state(true);
    let showUses = $derived(usesRequired(items));
    let showQuantity = $derived(quantityRequired(items));
</script>

<section>
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
