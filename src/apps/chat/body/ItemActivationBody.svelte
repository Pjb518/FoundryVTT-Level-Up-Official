<script>
    import { slide } from "svelte/transition";

    import zip from "../../../utils/zip";

    import AbilityCheckPromptButton from "./promptButtons/AbilityCheckPromptButton.svelte";
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
        savingThrow: SavingThrowPromptButton,
        abilityCheck: AbilityCheckPromptButton,
        skillCheck: SkillCheckPromptButton,
        generic: GenericRollPromptButton,
    };

    const { actionDescription, itemDescription } = $message.flags?.a5e;

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
</script>

<article>
    {#if !hideDescription}
        <section
            class="description-block"
            in:slide={{ duration: 150 }}
            out:slide={{ duration: 150 }}
        >
            {#if itemDescription}
                <hr class="a5e-rule a5e-rule--card" />

                <div>
                    {@html itemDescription}
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
                <h3 class="roll-label">{rollData.label}</h3>

                {#if rollData.userLabel}
                    <span class="roll-sublabel">{rollData.userLabel}</span>
                {/if}

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
        gap: 0.25rem;
    }

    .roll-container {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .roll-label {
        margin: 0;
        font-size: 0.833rem;
        font-weight: bold;
        border: 0;
    }

    .roll-sublabel {
        font-size: 0.694rem;
        color: #7e7960;
    }
</style>
