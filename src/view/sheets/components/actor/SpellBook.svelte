<script lang="ts">
    import { getContext } from "svelte";

    import { groupItemsByType } from "#utils/view/groupItemsByType.ts";
    import { usesRequired } from "#utils/view/usesRequired.ts";

    import ItemCategory from "../ItemCategory.svelte";

    type Props = {
        spellBookId: string;
        items: Item[];
    };

    let { spellBookId, items }: Props = $props();

    let actor: any = getContext("actor");
    let sheetIsLocked: () => boolean = getContext("sheetIsLocked");

    let actorStore = $derived(actor.reactive.system);

    let showUses = $derived(usesRequired(items));
    let spellBook = $derived(actor.reactive.spellBooks?.get(spellBookId));

    let categorizedItems = $derived(groupItemsByType(items, "level"));

    let isSpellLevelVisible = $derived((level: string) => {
        if (!sheetIsLocked()) return true;

        const maxSlots = actorStore.spellResources.slots[level]?.max ?? 0;
        const showSpellSlots =
            actor.reactive.flags?.a5e?.showSpellSlots ?? true;
        const spellQuantity = (categorizedItems[level] ?? []).length;

        if (spellQuantity) return true;
        if (showSpellSlots && maxSlots > 0) return true;

        return false;
    });

    let showDescription = $state(false);
</script>

<article class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    <section class="a5e-page-wrapper a5e-page-wrapper--item-list">
        {#each Object.entries(categorizedItems) as [label, itemList]}
            {#if isSpellLevelVisible(label)}
                <ItemCategory
                    {label}
                    {showDescription}
                    {showUses}
                    level={Number(label)}
                    showArtifactCharges={spellBook?.showArtifactCharges ??
                        false}
                    showSpellPoints={spellBook?.showSpellPoints ?? false}
                    showSpellSlots={spellBook?.showArtifactCharges ?? true}
                    items={itemList}
                    type="spellLevels"
                />
            {/if}
        {/each}
    </section>
</article>
