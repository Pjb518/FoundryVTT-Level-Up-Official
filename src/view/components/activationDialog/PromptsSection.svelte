<script lang="ts">
    import type { PromptHandlerReturnType } from "../../../apps/dataPreparationHelpers/itemActivationPrompts/preparePrompts.ts";

    import { RollPreparationManager } from "#managers/RollPreparationManager.ts";

    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";

    type Props = {
        selectedPrompts: string[];
        prompts: PromptHandlerReturnType;
    };

    let { selectedPrompts = $bindable(), prompts }: Props = $props();

    const promptHeadingMap = {
        abilityCheck: "Ability Check Prompts",
        effect: "Effect Prompts",
        savingThrow: "Saving Throw Prompts",
        skillCheck: "Skill Check Prompts",
        generic: "Generic Roll Prompts",
    };

    let disabledPrompts =
        RollPreparationManager.preparePromptsData(prompts).invalidSelections;
</script>

<FieldWrapper hint="A5E.PromptsHint">
    <div class="prompt-wrapper">
        {#each Object.entries(prompts) as [promptType, _prompts]}
            {#if _prompts.length}
                <CheckboxGroup
                    heading={promptHeadingMap[promptType]}
                    options={_prompts.map(([key, prompt]) => [
                        key,
                        prompt.label || prompt.defaultLabel || "",
                    ])}
                    disabledOptions={disabledPrompts}
                    selected={selectedPrompts}
                    onUpdateSelection={(detail) => (selectedPrompts = detail)}
                />
            {/if}
        {/each}
    </div>
</FieldWrapper>

<style lang="scss">
    .prompt-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
</style>
