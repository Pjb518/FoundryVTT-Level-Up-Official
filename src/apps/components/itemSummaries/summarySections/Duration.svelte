<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    export let actionId;
    export let item;

    function getDurationLabel({ duration } = {}) {
        if (!duration || !duration.unit || foundry.utils.isEmpty(duration)) {
            return null;
        }

        if (["instantaneous", "permanent", "special"].includes(duration.unit)) {
            return localize(CONFIG.A5E.timePeriods[duration.unit]);
        } else {
            if (duration.value === 0 || duration.value > 1) {
                return `${duration.value} ${localize(
                    CONFIG.A5E.timePeriodsPlural[duration.unit]
                )}`;
            } else {
                return `${duration.value ?? 1} ${localize(
                    CONFIG.A5E.timePeriods[duration.unit]
                )}`;
            }
        }
    }

    $: action = item.actions[actionId] ?? item.actions.values()[0];
    $: duration = getDurationLabel(action);

    $: showDuration =
        (actionId && duration) || (item.actions.count === 1 && duration);
</script>

{#if showDuration}
    <div class="summary-group">
        <dt>{localize("A5E.ItemDuration")}:</dt>
        <dd>
            {duration}
            {item.system.concentration
                ? `(${localize("A5E.SpellConcentration")})`
                : ""}
        </dd>
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
