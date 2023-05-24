<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import constructRollFormula from "../../../../dice/constructRollFormula";
    import prepareSelectedTokenActors from "../../../dataPreparationHelpers/prepareSelectedTokenActors";

    export let prompt;

    async function rollPrompt() {
        const tokenActors = prepareSelectedTokenActors();

        if (!tokenActors.length) {
            ui.notifications.warn("No tokens selected");
            return;
        }

        for (const token of tokenActors) {
            const { rollFormula } = constructRollFormula({
                actor: token,
                formula: prompt.formula,
            });

            await new Roll(rollFormula).toMessage({ async: true });
        }
    }
</script>

<button on:click={() => rollPrompt()}>
    {localize("A5E.GenericRollPrompt", {
        label: prompt?.label ?? localize("A5E.Other"),
    })}
</button>
