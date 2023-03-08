<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import constructGenericRollFormula from "../../../../dice/constructGenericRollFormula";
    import prepareSelectedTokenActors from "../../../dataPreparationHelpers/prepareSelectedTokenActors";

    export let key;
    export let prompt;

    async function rollPrompt() {
        const tokenActors = prepareSelectedTokenActors();

        for (const token of tokenActors) {
            const rollFormula = constructGenericRollFormula({
                actor: token,
                formula: prompt.formula,
            });

            const roll = await new Roll(rollFormula).roll({ async: true });

            // TODO: To Chat message
        }
    }
</script>

<button on:click={() => rollPrompt()}>
    {localize("A5E.GenericRollPrompt", {
        label: prompt?.label ?? localize("A5E.Other"),
    })}
</button>
