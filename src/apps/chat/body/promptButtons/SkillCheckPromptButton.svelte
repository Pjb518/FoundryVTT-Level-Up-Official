<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import prepareSelectedTokenActors from "../../../dataPreparationHelpers/prepareSelectedTokenActors";

    export let prompt;

    const { skills } = CONFIG.A5E;

    function rollPrompt() {
        const tokenActors = prepareSelectedTokenActors();

        tokenActors.forEach((token) => {
            token.rollSkillCheck(prompt.skill, { abilityKey: prompt.ability });
        });
    }
</script>

<button on:click={() => rollPrompt()}>
    {localize("A5E.SkillCheckPrompt", {
        skill: localize(skills[prompt.skill]),
    })}
</button>
