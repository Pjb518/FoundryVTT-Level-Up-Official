<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import AbilityCheckPromptButton from "./promptButtons/AbilityCheckPromptButton.svelte";
    import GenericRollPromptButton from "./promptButtons/GenericRollPromptButton.svelte";
    import SavingThrowPromptButton from "./promptButtons/SavingThrowPromptButton.svelte";
    import SkillCheckPromptButton from "./promptButtons/SkillCheckPromptButton.svelte";

    export let message;

    const promptComponentMap = {
        savingThrow: SavingThrowPromptButton,
        abilityCheck: AbilityCheckPromptButton,
        skillCheck: SkillCheckPromptButton,
        generic: GenericRollPromptButton,
    };

    $: description = $message.flags?.a5e?.description;

    $: prompts =
        $message.flags?.a5e?.prompts?.reduce((acc, [key, prompt]) => {
            acc[prompt.type] ??= [];
            acc[prompt.type].push([key, prompt]);

            return acc;
        }, {}) ?? {};

    $: rolls =
        $message.flags?.a5e?.rolls?.reduce((acc, [key, roll]) => {
            acc[roll.type] ??= [];
            acc[roll.type].push([key, roll]);

            return acc;
        }, {}) ?? {};
</script>

<article>
    {@debug prompts}

    {#if description}
        <hr class="a5e-rule a5e-rule--card" />

        {@html description}
    {/if}

    {#each Object.entries(promptComponentMap) as [promptType, Component]}
        {#if prompts[promptType]?.length}
            <section class="prompt-button-wrapper">
                {#each prompts[promptType] as [key, prompt]}
                    <Component {key} {prompt} />
                {/each}
            </section>
        {/if}
    {/each}
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding-top: 0.5rem;
    }

    .prompt-button-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
</style>
