<script lang="ts">
    import { getContext } from "svelte";

    import { filterEffects } from "#utils/view/filterEffects.ts";

    import EffectCategory from "#view/sheets/components/effect/EffectCategory.svelte";

    let item: any = getContext("item");
    let actionId: string = getContext("actionId");

    let effects = $derived(
        filterEffects(item.reactive, "onUse", {
            filters: {
                currentAction: (effect) =>
                    item.actions.get(actionId).effects.has(effect.id),
            },
        }),
    );

    const subTypes = CONFIG.A5E.actionActiveEffectTypesPlural;
</script>

{#if item.isOwner}
    <!--  -->
{/if}

<section class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    <EffectCategory label={subTypes.onUse} {effects} />
</section>
