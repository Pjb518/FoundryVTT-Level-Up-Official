<script lang="ts">
    import { getContext } from "svelte";

    import { createEffect } from "#utils/createActiveEffect.ts";
    import { filterEffects } from "#utils/view/filterEffects.ts";
    import { groupEffectsByType } from "#utils/view/groupEffectsByType..ts";

    import UtilityBar from "../../snippets/UtilityBar.svelte";
    import EffectCategory from "#view/sheets/components/effect/EffectCategory.svelte";

    function onAddIconClick() {
        createEffect(actor, { effectType: "passive" });
    }

    function sortHandler(reverse: boolean) {
        sheet._sortEmbeddedAlphabetically(effects, "ActiveEffect", reverse);
    }

    let filterOptions = $state({
        searchTerm: "",
        showDescription: false,
    });

    let actor: any = getContext("actor");
    let sheet: any = getContext("sheet");

    let effects = $derived(filterEffects(actor.reactive, "", filterOptions));
    let categorizedEffects = $derived(groupEffectsByType(effects));

    const openCompendium = game.a5e.utils.openCompendium;

    const subTypes = CONFIG.A5E.activeEffectTypes;
</script>

{#if actor.isOwner}
    <UtilityBar
        bind:filterOptions
        showAddIcon={true}
        showSortButton={true}
        {onAddIconClick}
        {sortHandler}
    />
{/if}

<section class="a5e-page-wrapper a5e-page-wrapper--item-list">
    {#each Object.entries(categorizedEffects) as [label, effectList]}
        {#if effectList.length > 0}
            <EffectCategory label={subTypes[label]} effects={effectList} />
        {/if}
    {/each}
</section>
