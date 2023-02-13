<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import AbilityCheckPromptConfig from "../itemActionsConfig/AbilityCheckPromptConfig.svelte";
    import GenericPromptConfig from "../itemActionsConfig/GenericPromptConfig.svelte";
    import PromptsConfigWrapper from "../itemActionsConfig/PromptsConfigWrapper.svelte";
    import SavePromptConfig from "../itemActionsConfig/SavePromptConfig.svelte";
    import SkillCheckPromptConfig from "../itemActionsConfig/SkillCheckPromptConfig.svelte";

    const item = getContext("item");
    const actionId = getContext("actionId");

    function addPrompt(type) {
        $item.update({
            [`system.actions.${actionId}.prompts`]: {
                ...action.prompts,
                [foundry.utils.randomID()]: { type },
            },
        });
    }

    const promptTypes = {
        savingThrow: {
            heading: "A5E.ActionConfigSavingThrowPrompt",
            component: SavePromptConfig,
        },
        abilityCheck: {
            heading: "A5E.ActionConfigAbilityCheckPrompt",
            component: AbilityCheckPromptConfig,
        },
        skillCheck: {
            heading: "A5E.ActionConfigSkillCheckPrompt",
            component: SkillCheckPromptConfig,
        },
        generic: {
            heading: "A5E.Other",
            component: GenericPromptConfig,
        },
    };

    $: action = $item.system.actions[actionId];
</script>

<ul class="prompts-config-list">
    {#each Object.entries(promptTypes) as [promptType, { heading, component }] (promptType)}
        <li class="prompts-config-list__item">
            <header class="action-config__section-header">
                <h2 class="action-config__section-heading">
                    {localize(heading)}
                </h2>

                <button
                    class="add-button"
                    on:click={() => addPrompt(promptType)}
                >
                    {localize("A5E.ButtonAddPrompt")}
                </button>
            </header>

            <ul class="prompts-list">
                {#each Object.entries(action.prompts ?? {}).filter(([_, prompt]) => prompt.type === promptType) as [promptId, prompt] (promptId)}
                    <PromptsConfigWrapper {prompt} {promptId}>
                        <svelte:component
                            this={component}
                            {prompt}
                            {promptId}
                        />
                    </PromptsConfigWrapper>
                {:else}
                    <li class="action-config__none">{localize("A5E.None")}</li>
                {/each}
            </ul>
        </li>
    {/each}
</ul>

<style lang="scss">
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
        gap: 0.75rem;
        list-style: none;
        padding: 0;
        margin: 0;

        &__item {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
    }
</style>
