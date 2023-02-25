<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    export let item;

    const action = item.actions.values()[0];
</script>

{#if item.system.degree === 0}
    <p class="summary">
        {localize(CONFIG.A5E.maneuverDegrees[item.system.degree])}
    </p>
{:else if item.system.degree > 0}
    <p class="summary">
        {localize(CONFIG.A5E.maneuverDegrees[item.system.degree])}

        {#if item.system.tradition}
            {localize(CONFIG.A5E.maneuverTraditions[item.system.tradition])}
        {/if}

        {#if item.system.isStance}
            Stance
        {/if}

        {#if item.system.exertionCost}
            ({item.system.exertionCost}
            {localize(
                `A5E.ExertionPoint${
                    item.system.exertionCost > 1 ? "Plural" : ""
                }`
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
