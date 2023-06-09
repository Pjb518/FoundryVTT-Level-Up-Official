<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import ActionsManager from "../../../managers/ActionsManager";

    import AbilityCheckPromptConfig from "../itemActionsConfig/AbilityCheckPromptConfig.svelte";
    import ActiveEffectPromptConfig from "../itemActionsConfig/ActiveEffectPromptConfig.svelte";
    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import GenericPromptConfig from "../itemActionsConfig/GenericPromptConfig.svelte";
    import PromptsConfigWrapper from "../itemActionsConfig/PromptsConfigWrapper.svelte";
    import SavePromptConfig from "../itemActionsConfig/SavePromptConfig.svelte";
    import SkillCheckPromptConfig from "../itemActionsConfig/SkillCheckPromptConfig.svelte";

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
        ([promptType, { heading }]) => [promptType, heading]
    );
</script>

<article>
    <ul class="prompts-config-list">
        {#each Object.entries(promptTypes) as [promptType, { heading, singleLabel, component }] (promptType)}
            {#if Object.values(prompts).filter((prompt) => prompt.type === promptType).length}
                <li class="prompts-config-list__item">
                    <header class="action-config__section-header">
                        <h2 class="action-config__section-heading">
                            {localize(heading)}
                        </h2>

                        <button
                            class="add-button"
                            on:click={() =>
                                ActionsManager.addPrompt(
                                    $item,
                                    [actionId, action],
                                    promptType
                                )}
                        >
                            {localize("A5E.ButtonAddPrompt", {
                                type: localize(singleLabel),
                            })}
                        </button>
                    </header>

                    <ul class="prompts-list">
                        {#each Object.entries(prompts).filter(([_, prompt]) => prompt.type === promptType) as [promptId, prompt] (promptId)}
                            <PromptsConfigWrapper {prompt} {promptId}>
                                <svelte:component
                                    this={component}
                                    {prompt}
                                    {promptId}
                                />
                            </PromptsConfigWrapper>
                        {:else}
                            <li class="action-config__none">
                                {localize("A5E.None")}
                            </li>
                        {/each}
                    </ul>
                </li>
            {/if}
        {/each}
    </ul>

    <div class="sticky-add-button">
        <CreateMenu
            {menuList}
            offset={{ x: -110, y: -105 }}
            documentName="Prompt"
            on:press={({ detail }) =>
                ActionsManager.addPrompt($item, [actionId, action], detail)}
        />
    </div>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 0.75rem;
        overflow: hidden;
    }

    .prompts-list {
        display: flex;
        flex-direction: column;
        position: relative;
        margin: 0;
        padding: 0;
        gap: 0.25rem;
        list-style: none;
    }

    .prompts-config-list {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        gap: 0.75rem;
        list-style: none;
        padding: 0;
        margin: 0;
        overflow-y: auto;

        &__item {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
    }

    .sticky-add-button {
        display: flex;
        justify-content: space-around;
        align-items: center;
        color: #999;
    }
</style>
