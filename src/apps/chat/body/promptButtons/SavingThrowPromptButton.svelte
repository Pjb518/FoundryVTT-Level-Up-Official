<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import prepareSelectedTokenActors from "../../../dataPreparationHelpers/prepareSelectedTokenActors";

    export let prompt;

    const { abilities } = CONFIG.A5E;

    function rollPrompt() {
        const tokenActors = prepareSelectedTokenActors();

        tokenActors.forEach((token) => {
            token.rollSavingThrow(prompt.ability);
        });
    }
</script>

<button on:click={() => rollPrompt()}>
    {localize("A5E.RollPromptSavingThrowWithDC", {
        ability: localize(abilities[prompt.ability]),
        dc: prompt.dc,
    })}
</button>
