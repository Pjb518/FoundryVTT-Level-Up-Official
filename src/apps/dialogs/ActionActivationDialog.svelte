<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import computeSaveDC from "../utils/computeSaveDC";
    import prepareAbilityCheckPrompts from "../dataPreparationHelpers/prepareAbilityCheckPrompts";
    import prepareGenericRollPrompts from "../dataPreparationHelpers/prepareGenericRollPrompts";
    import prepareSavingThrowPrompts from "../dataPreparationHelpers/prepareSavingThrowPrompts";
    import prepareSkillCheckPrompts from "../dataPreparationHelpers/prepareSkillCheckPrompts";

    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import FormSection from "../components/FormSection.svelte";

    export let { actionId, actorDocument, dialog, itemDocument, options } =
        getContext("#external").application;

    function getDefaultPromptSelections() {
        return Object.entries($item.actions[actionId].prompts).reduce(
            (acc, [key, prompt]) => {
                if (prompt.default) acc.push(key);
                return acc;
            },
            []
        );
    }

    function onSubmit() {
        // TODO: Clean this up. A lot of stuff here is prototyping for the chat cards
        dialog.submit({
            prompts: Object.entries(action.prompts)
                ?.filter(([key]) => selectedPrompts.includes(key))
                .map(([key, prompt]) => {
                    if (prompt.type === "savingThrow") {
                        prompt.dc = computeSaveDC($actor, prompt.saveDC);
                    }

                    return [key, prompt];
                }),
            rolls: Object.entries(action.rolls)?.filter(([key]) =>
                selectedPrompts.includes(key)
            ),
        });
    }

    const actor = new TJSDocument(actorDocument);
    const item = new TJSDocument(itemDocument);

    $: action = $item.actions[actionId];

    $: abilityCheckPrompts = prepareAbilityCheckPrompts(action.prompts);
    $: genericRollPrompts = prepareGenericRollPrompts(action.prompts);
    $: savingThrowPrompts = prepareSavingThrowPrompts(action.prompts);
    $: skillCheckPrompts = prepareSkillCheckPrompts(action.prompts);

    let selectedPrompts = getDefaultPromptSelections();
</script>

<form>
    <FormSection hint="A5E.PromptsHint">
        <div class="prompt-wrapper">
            {#each [abilityCheckPrompts, savingThrowPrompts, skillCheckPrompts, genericRollPrompts] as promptGroup}
                {#if promptGroup.length}
                    <section>
                        <h3 class="section-subheading">
                            Ability Check Prompts
                        </h3>

                        <CheckboxGroup
                            options={promptGroup}
                            selected={selectedPrompts}
                            on:updateSelection={(event) =>
                                (selectedPrompts = event.detail)}
                        />
                    </section>
                {/if}
            {/each}
        </div>
    </FormSection>

    <section>
        <button on:click|preventDefault={onSubmit}>
            <i class="fa-solid fa-dice" />
            {localize("A5E.DialogSubmitRoll")}
        </button>
    </section>
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem;
    }

    :global(small) {
        margin-top: 0.25rem;
    }

    .prompt-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .section-subheading {
        width: 100%;
        font-size: 0.833rem;
        font-weight: bold;
        margin-bottom: 0.25rem;
    }
</style>
