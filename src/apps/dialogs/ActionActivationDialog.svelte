<script>
    import { getContext } from "svelte";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

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
            {#if abilityCheckPrompts.length}
                <section>
                    <h3 class="section-subheading">Ability Check Prompts</h3>

                    <CheckboxGroup
                        options={abilityCheckPrompts}
                        selected={selectedPrompts}
                        on:updateSelection={(event) =>
                            (selectedPrompts = event.detail)}
                    />
                </section>
            {/if}

            {#if savingThrowPrompts.length}
                <section>
                    <h3 class="section-subheading">Skill Check Prompts</h3>

                    <CheckboxGroup
                        options={savingThrowPrompts}
                        selected={selectedPrompts}
                        on:updateSelection={(event) =>
                            (selectedPrompts = event.detail)}
                    />
                </section>
            {/if}

            {#if skillCheckPrompts.length}
                <section>
                    <h3 class="section-subheading">Skill Check Prompts</h3>

                    <CheckboxGroup
                        options={skillCheckPrompts}
                        selected={selectedPrompts}
                        on:updateSelection={(event) =>
                            (selectedPrompts = event.detail)}
                    />
                </section>
            {/if}

            {#if genericRollPrompts.length}
                <section>
                    <h3 class="section-subheading">Generic Roll Prompts</h3>

                    <CheckboxGroup
                        options={genericRollPrompts}
                        selected={selectedPrompts}
                        on:updateSelection={(event) =>
                            (selectedPrompts = event.detail)}
                    />
                </section>
            {/if}
        </div>
    </FormSection>
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
