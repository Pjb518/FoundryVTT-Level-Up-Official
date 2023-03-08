<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    export let key;
    export let prompt;

    const { skills } = CONFIG.A5E;
</script>

<button>
    {localize("A5E.SkillCheckPrompt", {
        skill: localize(skills[prompt.skill]),
    })}
</button>
