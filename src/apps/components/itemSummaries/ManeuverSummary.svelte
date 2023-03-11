<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import ActivationCost from "./summarySections/ActivationCost.svelte";
    import Range from "./summarySections/Range.svelte";

    export let actionId = "";
    export let item;

    $: action = item.actions[actionId] ?? item.actions.values()[0];

    const A5E = CONFIG.A5E;
</script>

{#if !actionId && item.system.degree === 0}
    <p class="summary">
        {localize(A5E.maneuverDegrees[item.system.degree])}
    </p>
{:else if !actionId && item.system.degree > 0}
    <p class="summary">
        {localize(A5E.maneuverDegrees[item.system.degree])}

        {#if item.system.tradition}
            {localize(A5E.maneuverTraditions[item.system.tradition])}
        {/if}

        {#if item.system.isStance}
            Stance
        {/if}

        {#if item.system.exertionCost}
            ({item.system.exertionCost}
            {localize(
                item.system.exertionCost > 1
                    ? "A5E.ExertionPointPlural"
                    : "A5E.ExertionPoint"
            )})
        {/if}
    </p>
{/if}

<dl class="summary-list">
    <ActivationCost {actionId} {item} />
    <Range {actionId} {item} />
</dl>

<style lang="scss">
    .summary {
        font-style: italic;
        margin-bottom: 0.5rem;
    }

    .summary-list {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin: 0.5rem 0;
    }
</style>
