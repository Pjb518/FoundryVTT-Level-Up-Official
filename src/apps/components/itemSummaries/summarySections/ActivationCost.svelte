<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import A5E from "../../../../config";

    export let actionId;
    export let item;

    function getActivationCostLabel({ activation } = {}) {
        if (!activation) return null;

        let label = "";

        if (activation?.type === "reaction") {
            label = localize("A5E.ActionActivationReaction");

            if (activation.reactionTrigger) {
                label += ` (${reactionTrigger})`;
            }

            return label;
        }

        if (activation?.cost === 0 || activation?.cost > 1) {
            label = `${activation.cost} ${localize(
                CONFIG.A5E.abilityActivationTypesPlural[activation.type]
            )}`;
        } else {
            label = `${activation?.cost} ${localize(
                CONFIG.A5E.abilityActivationTypes[activation?.type]
            )}`;
        }

        return label;
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
