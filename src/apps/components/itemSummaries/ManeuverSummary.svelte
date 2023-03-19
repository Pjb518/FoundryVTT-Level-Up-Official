<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import ActivationCost from "./summarySections/ActivationCost.svelte";
    import Area from "./summarySections/Area.svelte";
    import Duration from "./summarySections/Duration.svelte";
    import Range from "./summarySections/Range.svelte";
    import Targets from "./summarySections/Targets.svelte";

    export let actionId = "";
    export let item;

    const A5E = CONFIG.A5E;

    let listHeight;
</script>

{#if !actionId && parseInt(item.system.degree, 10) === 0}
    <p class="summary">
        {localize(A5E.maneuverDegrees[parseInt(item.system.degree, 10)])}
    </p>
{:else if !actionId && parseInt(item.system.degree, 10) > 0}
    <p class="summary">
        {localize(A5E.maneuverDegrees[parseInt(item.system.degree, 10)])}

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

<dl
    bind:clientHeight={listHeight}
    class="summary-list"
    class:hide={listHeight === 0}
>
    <ActivationCost {actionId} {item} />
    <Range {actionId} {item} />
    <Targets {actionId} {item} />
    <Area {actionId} {item} />
    <Duration {actionId} {item} />
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
        margin: 0 0 0.5rem 0;
    }

    .hide {
        display: none;
    }
</style>
