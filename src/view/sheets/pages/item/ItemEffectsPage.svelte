<script lang="ts">
    import { getContext } from "svelte";

    import { createEffect } from "#utils/createActiveEffect.ts";
    import { filterEffects } from "#utils/view/filterEffects.ts";

    import EffectCategory from "#view/sheets/components/effect/EffectCategory.svelte";
    import UtilityBar from "#view/snippets/UtilityBar.svelte";

    let item: any = getContext("item");

    function onAddIconClick() {
        createEffect(item, { effectType: "passive" });
    }

    let filterOptions = $state({
        searchTerm: "",
        showDescription: false,
    });

    let effects = $derived(
        filterEffects(item.reactive, "passive", filterOptions),
    );

    const subTypes = CONFIG.A5E.itemActiveEffectTypesPlural;
</script>

{#if item.isOwner}
    <UtilityBar
        bind:filterOptions
        showAddIcon={true}
        showSortButton={true}
        {onAddIconClick}
    />
{/if}

<section class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    <EffectCategory label={subTypes.passive} {effects} />
</section>
