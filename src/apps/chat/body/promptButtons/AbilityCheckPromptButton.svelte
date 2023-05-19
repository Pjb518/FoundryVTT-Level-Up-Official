<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import prepareSelectedTokenActors from "../../../dataPreparationHelpers/prepareSelectedTokenActors";

    export let prompt;

    const { abilities } = CONFIG.A5E;

    function rollPrompt() {
        const tokenActors = prepareSelectedTokenActors();

        if (!tokenActors.length) {
            ui.notifications.warn("No tokens selected");
            return;
        }

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
