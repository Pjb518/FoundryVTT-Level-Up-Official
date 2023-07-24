<script>
    import { localize } from "#runtime/svelte/helper";

    export let actionId;
    export let item;

    $: action = item.actions[actionId] ?? item.actions.values()[0];

    $: ranges = Object.values(action?.ranges ?? {}).map(({ range, unit }) => {
        if (["short", "medium", "long"].includes(range)) {
            return `${localize(CONFIG.A5E.rangeDescriptors[range])} (${
                CONFIG.A5E.rangeValues[range]
            } ft.)`;
        }

        if (["fiveFeet", "self", "touch"].includes(range)) {
            return localize(CONFIG.A5E.rangeDescriptors[range]);
        }

        return `${range} ${localize(CONFIG.A5E.distanceUnits[unit])}`;
    });

    $: showRange =
        (actionId && ranges.length) ||
        (item.actions.count === 1 && ranges.length);
</script>

{#if showRange}
    <div class="summary-group">
        <dt>{localize("A5E.ItemRange")}:</dt>
        <dd>{ranges.join(", ")}</dd>
    </div>
{/if}

<style lang="scss">
    dt {
        white-space: nowrap;
    }

    dd {
        margin: 0;
        padding: 0;
    }

    .summary-group {
        display: flex;
        align-items: flex-start;
        gap: 0.25rem;
    }
</style>
