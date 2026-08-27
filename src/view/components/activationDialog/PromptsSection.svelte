<script lang="ts">
    import type { RollStateManager } from "#managers/RollStateManager.ts";

    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";

    type Props = {
        selectedPrompts: string[];
        prompts: RollStateManager.state["prompts"];
        stateConfig: RollStateManager.state["config"];
    };

    let {
        selectedPrompts = $bindable(),
        prompts,
        stateConfig,
    }: Props = $props();

    const promptHeadingMap = {
        abilityCheck: "Ability Check Prompts",
        effect: "Effect Prompts",
        savingThrow: "Saving Throw Prompts",
        skillCheck: "Skill Check Prompts",
        generic: "Generic Roll Prompts",
    };

    const disabledPrompts = stateConfig.invalids.prompts;
</script>

<FieldWrapper hint="A5E.PromptsHint">
    <div class="prompt-wrapper">
        {#each Object.entries(prompts) as [promptType, _prompts]}
            {#if _prompts.length}
                <CheckboxGroup
                    heading={promptHeadingMap[promptType]}
                    options={_prompts.map((prompt) => [
                        prompt.id,
                        prompt.label || prompt.defaultLabel || "",
                    ])}
                    red={disabledPrompts}
                    disabledOptions={disabledPrompts}
                    preferColor={true}
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
