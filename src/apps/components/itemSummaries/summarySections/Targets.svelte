<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    export let actionId;
    export let item;

    function getTargetLabel({ target } = {}) {
        if (!target || !target.type || foundry.utils.isEmpty(target)) {
            return null;
        }

        if (target?.type === "self") return localize("A5E.TargetSelf");
        if (target?.type === "other") return localize("A5E.TargetOther");

        if (target?.quantity === 0 || target?.quantity > 1) {
            return `${target.quantity} ${localize(
                CONFIG.A5E.targetTypesPlural[target.type]
            )}`;
        } else {
            return `${target?.quantity ?? 1} ${localize(
                CONFIG.A5E.targetTypes[target?.type]
            )}`;
        }
    }

    $: action = item.actions[actionId] ?? item.actions.values()[0];
    $: target = getTargetLabel(action);

    $: showTarget =
        (actionId && target) || (item.actions.count === 1 && target);
</script>

{#if showTarget}
    <div class="summary-group">
        <dt>{localize("A5E.ItemTargetPlural")}:</dt>
        <dd>{target}</dd>
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
