<script lang="ts">
    import { getContext } from "svelte";

    import { filterEffects } from "#utils/view/filterEffects.ts";
    import { groupEffectsByType } from "#utils/view/groupEffectsByType..ts";

    import EffectCategory from "#view/sheets/components/effect/EffectCategory.svelte";

    let actor: any = getContext("actor");

    let effects = $derived(filterEffects(actor.reactive, ""));
    let categorizedEffects = $derived(groupEffectsByType(effects));

    const openCompendium = game.a5e.utils.openCompendium;

    const subTypes = CONFIG.A5E.activeEffectTypes;
</script>

{#if actor.isOwner}
    <!--  -->
{/if}

<section class="a5e-page-wrapper a5e-page-wrapper--item-list">
    {#each Object.entries(categorizedEffects) as [label, effectList]}
        {#if effectList.length > 0}
            <EffectCategory label={subTypes[label]} effects={effectList} />
        {/if}
    {/each}
</section>
