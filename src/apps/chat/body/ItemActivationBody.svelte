<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import zip from "../../../utils/zip";

    import AbilityCheckPromptButton from "./promptButtons/AbilityCheckPromptButton.svelte";
    import D20Roll from "../dice/D20Roll.svelte";
    import GenericRollPromptButton from "./promptButtons/GenericRollPromptButton.svelte";
    import Roll from "../dice/Roll.svelte";
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
            case "damage":
                return rollData?.roll?.damageType
                    ? localize("A5E.DamageSpecific", {
                          damageType: localize(
                              damageTypes[rollData?.roll?.damageType]
                          ),
                      })
                    : localize("A5E.Damage");
            case "healing":
                return rollData?.roll?.healingType === "temporaryHealing"
                    ? localize("A5E.HealingTemporary")
                    : localize("A5E.Healing");
            case "savingThrow":
                return localize("A5E.SavingThrowSpecific", { ability });
            case "skillCheck":
                return ability
                    ? localize("A5E.SkillCheckAbility", { skill, ability })
                    : localize("A5E.SkillCheck", { skill });
        }
    }

    const { abilities, damageTypes, skills } = CONFIG.A5E;

    const rollSortKeyMap = {
        attack: 0,
        damage: 1,
        healing: 2,
        abilityCheck: 3,
        skillCheck: 4,
        savingThrow: 5,
        generic: 6,
    };

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

    const rolls = zip($message.rolls, $message.flags?.a5e?.rollData).sort(
        (a, b) =>
            rollSortKeyMap[a[1].roll.type] - rollSortKeyMap[b[1].roll.type]
    );

    console.log(rolls);

    const hasRolls = rolls.length;
    const hasPrompts = Object.values(prompts).flat().length;
</script>

<article>
    {#if description}
        <hr class="a5e-rule a5e-rule--card" />

        {@html description}
    {/if}

    {#each rolls ?? [] as [roll, rollData]}
        {#if ["abilityCheck", "savingThrow", "skillCheck"].includes(rollData.roll.type)}
            <div>
                <h3 class="roll-label">{getTitle(rollData)}</h3>
                <D20Roll {roll} />
            </div>
        {/if}

        {#if ["damage", "healing"].includes(rollData.roll.type)}
            <div>
                <h3 class="roll-label">{getTitle(rollData)}</h3>
                <Roll {roll} />
            </div>
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
