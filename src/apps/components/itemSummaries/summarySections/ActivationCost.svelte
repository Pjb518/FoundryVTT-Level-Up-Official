<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    export let actionId;
    export let item;

    function getActivationCostLabel({ activation } = {}) {
        if (
            !activation ||
            !activation.type ||
            foundry.utils.isEmpty(activation)
        ) {
            return null;
        }

        if (activation?.type === "reaction") {
            let label = localize("A5E.ActionActivationReaction");

            if (activation?.reactionTrigger) {
                label += ` (${activation.reactionTrigger})`;
            }

            return label;
        }

        if (activation?.cost === 0 || activation?.cost > 1) {
            return `${activation.cost} ${localize(
                CONFIG.A5E.abilityActivationTypesPlural[activation.type]
            )}`;
        } else if (["none", "special"].includes(activation?.type)) {
            return localize(
                CONFIG.A5E.abilityActivationTypes[activation?.type]
            );
        } else {
            return `${activation?.cost} ${localize(
                CONFIG.A5E.abilityActivationTypes[activation?.type]
            )}`;
        }
    }

    $: action = item.actions[actionId] ?? item.actions.values()[0];
    $: activationCost = getActivationCostLabel(action);

    $: showActivationCost =
        (actionId && activationCost) ||
        (item.actions.count === 1 && activationCost);
</script>

{#if showActivationCost}
    <div class="summary-group">
        <dt>{localize("A5E.ActionActivationCost")}:</dt>
        <dd>{activationCost}</dd>
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
