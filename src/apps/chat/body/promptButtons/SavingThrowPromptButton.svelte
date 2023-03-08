<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    export let key;
    export let prompt;

    const { abilities } = CONFIG.A5E;
</script>

<button>
    {localize("A5E.RollPromptSavingThrow", {
        ability: localize(abilities[prompt.ability]),
        dc: prompt.dc,
    })}
</button>
