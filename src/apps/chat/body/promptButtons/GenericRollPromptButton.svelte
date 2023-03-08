<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import prepareSelectedTokenActors from "../../../dataPreparationHelpers/prepareSelectedTokenActors";

    export let key;
    export let prompt;

    const { skills } = CONFIG.A5E;

    function rollPrompt() {
        const tokenActors = prepareSelectedTokenActors();

        tokenActors.forEach((t) => {});
    }
</script>

<button on:click={() => rollPrompt()}>
    {localize("A5E.GenericRollPrompt", {
        label: prompt.label,
    })}
</button>
