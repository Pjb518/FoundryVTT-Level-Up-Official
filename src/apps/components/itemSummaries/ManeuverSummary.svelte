<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    export let item;

    const A5E = CONFIG.A5E;
    const action = item.actions.values()[0];
</script>

{#if item.system.degree === 0}
    <p class="summary">
        {localize(A5E.maneuverDegrees[item.system.degree])}
    </p>
{:else if item.system.degree > 0}
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

<style lang="scss">
    .summary {
        font-style: italic;
        margin-bottom: 0.5rem;
    }
</style>
