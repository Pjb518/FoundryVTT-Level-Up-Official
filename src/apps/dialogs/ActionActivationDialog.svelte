<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import computeSaveDC from "../utils/computeSaveDC";

    import preparePrompts from "../dataPreparationHelpers/preparePrompts";
    import prepareDamageRolls from "../dataPreparationHelpers/prepareDamageRolls";

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
            prompts: Object.entries(action.prompts ?? {})
                ?.filter(([key]) => selectedPrompts.includes(key))
                .map(([key, prompt]) => {
                    if (prompt.type === "savingThrow") {
                        prompt.dc = computeSaveDC($actor, prompt.saveDC);
                    }

                    return [key, prompt];
                }),
            rolls: Object.entries(action.rolls ?? {})?.filter(([key]) =>
                selectedPrompts.includes(key)
            ),
        });
    }

    const promptHeadingMap = {
        abilityCheck: "Ability Check Prompts",
        savingThrow: "Saving Throw Prompts",
        skillCheck: "Skill Check Prompts",
        generic: "Generic Roll Prompts",
    };

    const actor = new TJSDocument(actorDocument);
    const item = new TJSDocument(itemDocument);

    $: action = $item.actions[actionId];
    $: prompts = preparePrompts(action.prompts);
    $: damageRolls = prepareDamageRolls(action.rolls);

    let selectedPrompts = getDefaultPromptSelections();
</script>

<form>
    <FormSection>
        <div class="roll-wrapper">
            {#each [damageRolls] as rollGroup}
                {#if rollGroup.length}
                    <section>
                        <h3 class="section-subheading">Damage Rolls</h3>

                        <CheckboxGroup
                            options={rollGroup}
                            selected={selectedPrompts}
                            on:updateSelection={(event) =>
                                (selectedPrompts = event.detail)}
                        />
                    </section>
                {/if}
            {/each}
        </div>
    </FormSection>

    <FormSection hint="A5E.PromptsHint">
        <div class="prompt-wrapper">
            {#each Object.entries(prompts) as [promptType, _prompts]}
                {#if _prompts.length}
                    <section>
                        <h3 class="section-subheading">
                            {promptHeadingMap[promptType]}
                        </h3>

                        <CheckboxGroup
                            options={_prompts}
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

    .roll-wrapper,
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
