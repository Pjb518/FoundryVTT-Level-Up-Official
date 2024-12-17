<script lang="ts">
import type { PromptHandlerReturnType } from '../../dataPreparationHelpers/itemActivationPrompts/preparePrompts';

import { RollPreparationManager } from '../../../managers/RollPreparationManager';

import CheckboxGroup from '../CheckboxGroup.svelte';
import FieldWrapper from '../FieldWrapper.svelte';

export let selectedPrompts: string[];
export let prompts: PromptHandlerReturnType;

const promptHeadingMap = {
	abilityCheck: 'Ability Check Prompts',
	effect: 'Effect Prompts',
	savingThrow: 'Saving Throw Prompts',
	skillCheck: 'Skill Check Prompts',
	generic: 'Generic Roll Prompts',
};

let disabledPrompts = RollPreparationManager.preparePromptsData(prompts).invalidSelections;
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
                    on:updateSelection={(event) => (selectedPrompts = event.detail)}
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
