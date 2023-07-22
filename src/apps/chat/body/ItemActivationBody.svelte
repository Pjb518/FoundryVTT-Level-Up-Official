<script>
    import { slide } from "svelte/transition";

    import zip from "../../../utils/zip";

    import AbilityCheckPromptButton from "./promptButtons/AbilityCheckPromptButton.svelte";
    import ActiveEffectPromptButton from "./promptButtons/ActiveEffectPromptButton.svelte";
    import D20Roll from "../dice/D20Roll.svelte";
    import GenericRollPromptButton from "./promptButtons/GenericRollPromptButton.svelte";
    import Roll from "../dice/Roll.svelte";
    import SavingThrowPromptButton from "./promptButtons/SavingThrowPromptButton.svelte";
    import SkillCheckPromptButton from "./promptButtons/SkillCheckPromptButton.svelte";

    export let message;
    export let hideDescription = false;

    const rollSortKeyMap = {
        attack: 0,
        damage: 1,
        healing: 2,
        abilityCheck: 3,
        skillCheck: 4,
        savingThrow: 5,
        toolCheck: 6,
        generic: 7,
    };

    const promptComponentMap = {
        abilityCheck: AbilityCheckPromptButton,
        effect: ActiveEffectPromptButton,
        savingThrow: SavingThrowPromptButton,
        skillCheck: SkillCheckPromptButton,
        generic: GenericRollPromptButton,
    };

    const { actionDescription, itemDescription, unidentifiedDescription } =
        $message.flags?.a5e;

    const prompts =
        $message.flags?.a5e?.prompts?.reduce((acc, prompt) => {
            acc[prompt.type] ??= [];
            acc[prompt.type].push(prompt);

            return acc;
        }, {}) ?? {};

    const rolls = zip($message.rolls, $message.flags?.a5e?.rollData).sort(
        (a, b) => rollSortKeyMap[a[1]?.type] - rollSortKeyMap[b[1]?.type]
    );

    const hasRolls = rolls.length;
    const hasPrompts = Object.values(prompts).flat().length;
    const item = fromUuidSync($message?.flags?.a5e?.itemId ?? "");
</script>

<article>
    {#if !hideDescription}
        <section
            class="description-block"
            in:slide={{ duration: 150 }}
            out:slide={{ duration: 150 }}
        >
            {#if itemDescription || unidentifiedDescription}
                <hr class="a5e-rule a5e-rule--card" />

                <div>
                    <!-- svelte-ignore missing-declaration -->
                    {#if !game.user.isGM && item?.type === "object" && item?.system?.unidentified}
                        {@html unidentifiedDescription}
                    {:else}
                        {@html itemDescription}
                    {/if}
                </div>
            {/if}

            {#if actionDescription}
                <hr class="a5e-rule a5e-rule--card" />

                <div>
                    {@html actionDescription}
                </div>
            {/if}
        </section>
    {/if}

    {#if hasRolls}
        <hr class="a5e-rule a5e-rule--card" />

        {#each rolls ?? [] as [roll, rollData]}
            <div class="roll-container">
                <header class="roll-header">
                    <h3 class="roll-label">{rollData.label}</h3>

                    {#if rollData.rollMode === 1}
                        <span
                            class="roll-mode-label roll-mode-label--advantage"
                            data-tooltip="Advantage"
                            data-tooltip-direction="LEFT"
                        >
                            Adv
                        </span>
                    {:else if rollData.rollMode === -1}
                        <span
                            class="roll-mode-label roll-mode-label--disadvantage"
                            data-tooltip="Disadvantage"
                            data-tooltip-direction="LEFT"
                        >
                            Dis
                        </span>
                    {/if}

                    {#if rollData.userLabel}
                        <span class="roll-sublabel">{rollData.userLabel}</span>
                    {/if}
                </header>

                {#if ["abilityCheck", "attack", "savingThrow", "skillCheck", "toolCheck"].includes(rollData.type)}
                    <D20Roll {roll} critThreshold={rollData.critThreshold} />
                {:else}
                    <Roll {roll} {rollData} />
                {/if}
            </div>
        {/each}
    {/if}

    {#if hasPrompts}
        <hr class="a5e-rule a5e-rule--card" />

        {#each Object.entries(promptComponentMap) as [promptType, Component]}
            {#if prompts[promptType]?.length}
                <section class="prompt-button-wrapper">
                    {#each prompts[promptType] as prompt}
                        <Component {prompt} />
                    {/each}
                </section>
            {/if}
        {/each}
    {/if}
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding-top: 0.5rem;
    }

    .description-block {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .prompt-button-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .roll-container {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .roll-header {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }

    .roll-label {
        width: fit-content;
        margin: 0;
        font-size: 0.833rem;
        font-weight: bold;
        border: 0;
    }

    .roll-mode-label {
        display: block;
        flex-shrink: 0;
        width: fit-content;
        margin-left: auto;
        padding: 0.15rem 0.4rem;
        font-size: 0.694rem;
        line-height: 1;
        color: white;
        border: 1px solid;
        border-radius: 3px;

        &--advantage {
            border-color: #425f65;
            background: #425f65;
        }

        &--disadvantage {
            border-color: #772020;
            background: #8b2525;
        }
    }

    .roll-sublabel {
        width: 100%;
        font-size: 0.694rem;
        color: #7e7960;
    }
</style>
