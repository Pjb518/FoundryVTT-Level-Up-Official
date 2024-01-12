<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import ActionsManager from "../../../managers/ActionsManager";

    import AbilityCheckPromptConfig from "../itemActionsConfig/AbilityCheckPromptConfig.svelte";
    import ActiveEffectPromptConfig from "../itemActionsConfig/ActiveEffectPromptConfig.svelte";
    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import GenericPromptConfig from "../itemActionsConfig/GenericPromptConfig.svelte";
    import SavePromptConfig from "../itemActionsConfig/SavePromptConfig.svelte";
    import Section from "../Section.svelte";
    import SkillCheckPromptConfig from "../itemActionsConfig/SkillCheckPromptConfig.svelte";

    function deletePrompt(actionId, promptId) {
        $item.update({
            [`system.actions.${actionId}.prompts`]: {
                [`-=${promptId}`]: null,
            },
        });
    }

    function duplicatePrompt(actionId, prompt) {
        const newPrompt = foundry.utils.duplicate(prompt);

        $item.update({
            [`system.actions.${actionId}.prompts`]: {
                [foundry.utils.randomID()]: newPrompt,
            },
        });
    }

    const item = getContext("item");
    const actionId = getContext("actionId");

    const promptTypes = {
        savingThrow: {
            heading: "A5E.SavingThrowPlural",
            singleLabel: "A5E.SavingThrow",
            component: SavePromptConfig,
        },
        abilityCheck: {
            heading: "A5E.AbilityCheckPlural",
            singleLabel: "A5E.AbilityCheck",
            component: AbilityCheckPromptConfig,
        },
        skillCheck: {
            heading: "A5E.SkillCheckPlural",
            singleLabel: "A5E.SkillCheckSingular",
            component: SkillCheckPromptConfig,
        },
        generic: {
            heading: "A5E.OtherPlural",
            singleLabel: "A5E.Other",
            component: GenericPromptConfig,
        },
        effect: {
            heading: "A5E.EffectPlural",
            singleLabel: "A5E.Effect",
            component: ActiveEffectPromptConfig,
        },
    };

    $: action = $item.actions[actionId];
    $: prompts = action.prompts ?? {};

    $: menuList = Object.entries(promptTypes).map(
        ([promptType, { heading }]) => [promptType, heading],
    );
</script>

<div class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    <ul class="prompts-config-list">
        {#each Object.entries(promptTypes) as [promptType, { heading, singleLabel, component }] (promptType)}
            {#if Object.values(prompts).filter((prompt) => prompt.type === promptType).length}
                <li class="prompts-config-list__item">
                    <Section
                        {heading}
                        headerButtons={[
                            {
                                classes: "add-button",
                                handler: () =>
                                    ActionsManager.addPrompt(
                                        $item,
                                        [actionId, action],
                                        promptType,
                                    ),
                                label: localize("A5E.ButtonAddPrompt", {
                                    type: localize(singleLabel),
                                }),
                            },
                        ]}
                        --a5e-section-gap="0"
                    >
                        <ul class="a5e-item-list">
                            {#each Object.entries(prompts).filter(([_, prompt]) => prompt.type === promptType) as [promptId, prompt] (promptId)}
                                <li class="a5e-item a5e-item--action-config">
                                    <svelte:component
                                        this={component}
                                        {prompt}
                                        {promptId}
                                        {deletePrompt}
                                        {duplicatePrompt}
                                    />
                                </li>
                            {/each}
                        </ul>
                    </Section>
                </li>
            {/if}
        {/each}
    </ul>
</div>

<div class="sticky-add-button">
    <CreateMenu
        {menuList}
        offset={{ x: -110, y: -105 }}
        documentName="Prompt"
        on:press={({ detail }) =>
            ActionsManager.addPrompt($item, [actionId, action], detail)}
    />
</div>

<style lang="scss">
    .prompts-config-list {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        gap: 0.75rem;
        list-style: none;
        margin: 0;
        padding: 0;

        &__item {
            display: flex;
            flex-direction: column;
        }
    }

    .sticky-add-button {
        display: flex;
        justify-content: space-around;
        align-items: center;
        color: #999;
    }
</style>
