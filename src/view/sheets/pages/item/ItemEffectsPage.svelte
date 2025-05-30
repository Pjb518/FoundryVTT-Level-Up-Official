<script lang="ts">
    import { getContext } from "svelte";

    import { filterEffects } from "#utils/view/filterEffects.ts";

    import EffectCategory from "#view/sheets/components/effect/EffectCategory.svelte";

    let item: any = getContext("item");

    let effects = $derived(filterEffects(item.reactive, "passive"));

    const subTypes = CONFIG.A5E.itemActiveEffectTypesPlural;
</script>

{#if item.isOwner}
    <!--  -->
{/if}

<section class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    <EffectCategory label={subTypes.passive} {effects} />
</section>
