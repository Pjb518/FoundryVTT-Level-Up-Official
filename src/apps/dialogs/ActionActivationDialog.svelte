<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import CheckboxGroup from "../components/CheckboxGroup.svelte";

    export let { actionId, actorDocument, dialog, itemDocument, options } =
        getContext("#external").application;

    function getDefaultPromptLabel(prompt) {
        switch (prompt.type) {
            case "savingThrow":
                return localize("A5E.SavingThrowSpecific", {
                    ability: localize(CONFIG.A5E.abilities[prompt.ability]),
                });
            case "abilityCheck":
                return localize("A5E.AbilityCheckSpecific", {
                    ability: localize(CONFIG.A5E.abilities[prompt.ability]),
                });
            case "skillCheck":
                return localize("A5E.SkillCheck", {
                    skill: localize(CONFIG.A5E.skills[prompt.skill]),
                });
            case "generic":
                return localize("A5E.Other");
        }
    }

    function getDefaultPromptSelections() {
        return Object.entries($item.actions[actionId].prompts).reduce(
            (acc, [key, prompt]) => {
                if (prompt.default) acc.push(key);
                return acc;
            },
            []
        );
    }

    const actor = new TJSDocument(actorDocument);
    const item = new TJSDocument(itemDocument);

    $: action = $item.actions[actionId];

    $: prompts = Object.entries(action.prompts).map(([key, prompt]) => [
        key,
        prompt.label ?? getDefaultPromptLabel(prompt),
    ]);

    let selectedPrompts = getDefaultPromptSelections();
</script>

<form>
    <CheckboxGroup
        options={prompts}
        selected={selectedPrompts}
        on:updateSelection={(event) => (selectedPrompts = event.detail)}
    />
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem;
    }
</style>
