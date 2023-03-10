<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import AbilityCheckPromptButton from "./promptButtons/AbilityCheckPromptButton.svelte";
    import D20Roll from "../dice/D20Roll.svelte";
    import GenericRollPromptButton from "./promptButtons/GenericRollPromptButton.svelte";
    import SavingThrowPromptButton from "./promptButtons/SavingThrowPromptButton.svelte";
    import SkillCheckPromptButton from "./promptButtons/SkillCheckPromptButton.svelte";

    export let message;

    function getTitle(rollData) {
        const ability = localize(
            abilities[rollData?.abilityKey ?? rollData?.roll?.ability ?? ""]
        );

        const skill = localize(skills[rollData?.roll?.skill ?? ""]);

        switch (rollData.roll.type) {
            case "abilityCheck":
                return localize("A5E.AbilityCheckSpecific", { ability });
            case "savingThrow":
                return localize("A5E.SavingThrowSpecific", { ability });
            case "skillCheck":
                return ability
                    ? localize("A5E.SkillCheckAbility", { skill, ability })
                    : localize("A5E.SkillCheck", { skill });
        }
    }

    const { abilities, skills } = CONFIG.A5E;

    const promptComponentMap = {
        savingThrow: SavingThrowPromptButton,
        abilityCheck: AbilityCheckPromptButton,
        skillCheck: SkillCheckPromptButton,
        generic: GenericRollPromptButton,
    };

    const description = $message.flags?.a5e?.description;

    const prompts =
        $message.flags?.a5e?.prompts?.reduce((acc, [key, prompt]) => {
            acc[prompt.type] ??= [];
            acc[prompt.type].push([key, prompt]);

            return acc;
        }, {}) ?? {};

    const rolls = $message.rolls;
    const rollData = $message.flags?.a5e?.rollData;

    const hasRolls = rolls.length;
    const hasPrompts = Object.values(prompts).flat().length;
</script>

<article>
    {#if description}
        <hr class="a5e-rule a5e-rule--card" />

        {@html description}
    {/if}

    {#each rolls ?? [] as roll, i}
        {#if ["abilityCheck", "savingThrow", "skillCheck"].includes(rollData[i].roll.type)}
            <div>
                <h3 class="roll-label">{getTitle(rollData[i])}</h3>
                <D20Roll {roll} />
            </div>
        {/if}

        {#if rollData[i].roll.type === "damage"}
            {roll.formula}
        {/if}
    {/each}

    {#if hasRolls && hasPrompts}
        <hr class="a5e-rule a5e-rule--card" />
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
        gap: 0.25rem;
        padding-top: 0.5rem;
    }

    .prompt-button-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .roll-label {
        margin: 0;
        padding-bottom: 0.125rem;
        font-size: 0.833rem;
        border: 0;
    }
</style>
