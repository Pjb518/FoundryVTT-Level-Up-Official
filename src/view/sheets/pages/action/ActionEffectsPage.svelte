<script lang="ts">
    import { getContext } from "svelte";

    import { createEffect } from "#utils/createActiveEffect.ts";
    import { filterEffects } from "#utils/view/filterEffects.ts";

    import EffectCategory from "#view/sheets/components/effect/EffectCategory.svelte";
    import UtilityBar from "#view/snippets/UtilityBar.svelte";

    function addClick() {
        createEffect(item, { effectType: "onUse", actionId });
    }

    let filterOptions = $state({
        searchTerm: "",
        showDescription: false,
    });

    let item: any = getContext("item");
    let actionId: string = getContext("actionId");

    let effects = $derived(
        filterEffects(item.reactive, "onUse", {
            ...filterOptions,
            filters: {
                currentAction: (effect) =>
                    item.actions.get(actionId).effects.has(effect.id),
            },
        }),
    );

    const subTypes = CONFIG.A5E.actionActiveEffectTypesPlural;
</script>

{#if item.isOwner}
    <UtilityBar
        bind:filterOptions
        showAddIcon={true}
        showSortButton={true}
        onAddIconClick={addClick}
    />
{/if}

<section class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    <EffectCategory label={subTypes.onUse} {effects} />
</section>
