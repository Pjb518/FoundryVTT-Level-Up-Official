<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import prepareSelectedTokenActors from "../../../dataPreparationHelpers/prepareSelectedTokenActors";

    export let key;
    export let prompt;

    const { abilities } = CONFIG.A5E;

    function rollPrompt() {
        const tokenActors = prepareSelectedTokenActors();

        // Roll Ability Check
        tokenActors.forEach((a) => {
            a.rollAbilityCheck(prompt.ability);
        });
    }
</script>

<button on:click={() => rollPrompt()}>
    {localize("A5E.AbilityCheckPrompt", {
        ability: localize(abilities[prompt.ability]),
    })}
</button>
