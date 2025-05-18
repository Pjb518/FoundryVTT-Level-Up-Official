<script lang="ts">
    import type { Action } from "#types/action.d.ts";
    import type { ActionComponentType } from "#view/sheets/components/action/data.ts";

    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import { ActionsManager } from "#managers/ActionsManager.ts";

    import Section from "#view/snippets/Section.svelte";

    import AbilityCheckPromptConfig from "../../components/action/AbilityCheckPromptConfig.svelte";
    import GenericPromptConfig from "../../components/action/GenericPromptConfig.svelte";
    import SavingThrowPromptConfig from "../../components/action/SavingThrowPromptConfig.svelte";
    import SkillCheckPromptConfig from "../../components/action/SkillCheckPromptConfig.svelte";

    async function deletePrompt(actionId: string, promptId: string) {
        // Close Dialog
        const dialog = item.dialogs.rollScaling[promptId];
        await dialog?.close();
        delete item.dialogs.rollScaling[promptId];

        item.update({
            [`system.actions.${actionId}.prompts`]: {
                [`-=${promptId}`]: null,
            },
        });
    }

    function duplicatePrompt(actionId: string, prompt: Record<string, any>) {
        const newPrompt = foundry.utils.duplicate(prompt);

        item.update({
            [`system.actions.${actionId}.prompts`]: {
                [foundry.utils.randomID()]: newPrompt,
            },
        });
    }

    let item: any = getContext("item");
    let actionId: string = getContext("actionId");

    const promptTypes: Record<string, ActionComponentType> = {
        savingThrow: {
            heading: "A5E.rollLabels.savingThrows.titlePlural",
            singleLabel: "A5E.rollLabels.savingThrows.title",
            component: SavingThrowPromptConfig,
        },
        abilityCheck: {
            heading: "A5E.abilities.headings.checkPlural",
            singleLabel: "A5E.abilities.headings.check",
            component: AbilityCheckPromptConfig,
        },
        skillCheck: {
            heading: "A5E.skillLabels.checks.titlePlural",
            singleLabel: "A5E.skillLabels.checks.title",
            component: SkillCheckPromptConfig,
        },
        generic: {
            heading: "A5E.actions.labels.otherPlural",
            singleLabel: "A5E.actions.labels.other",
            component: GenericPromptConfig,
        },
    };

    let action = $derived(item.reactive.actions.get(actionId));
    let prompts: [string, any][] = $derived(
        Object.entries(action.prompts ?? {}),
    );

    $inspect(action.prompts);
</script>

{#snippet PromptListItem(promptType: string, promptConfig: ActionComponentType)}
    <Section
        heading={promptConfig.heading}
        headerButtons={[
            {
                classes: "add-button",
                handler: () =>
                    ActionsManager.addPrompt(
                        item,
                        [actionId, action],
                        promptType,
                    ),
                label: localize("A5E.buttons.addPrompt", {
                    type: localize(
                        promptConfig.buttonLabel ?? promptConfig.singleLabel,
                    ),
                }),
            },
        ]}
        --a5e-section-gap="0"
    >
        <ul class="a5e-item-list">
            {#each prompts.filter(([, prompt]) => prompt.type === promptType) as [promptId, prompt] (promptId)}
                <li class="a5e-item a5e-item--action-config">
                    <promptConfig.component
                        {deletePrompt}
                        {duplicatePrompt}
                        {prompt}
                        {promptId}
                    />
                </li>
            {/each}
        </ul>
    </Section>
{/snippet}

<div class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    <ul class="a5e-action-config__list">
        {#each Object.entries(promptTypes) as [promptType, promptConfig] (promptType)}
            {#if prompts.filter(([, prompt]) => prompt.type === promptType).length}
                <li class="a5e-action-config__list-item">
                    {@render PromptListItem(promptType, promptConfig)}
                </li>
            {/if}
        {/each}
    </ul>
</div>
