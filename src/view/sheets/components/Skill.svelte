<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import { pressedKeys } from "#stores/pressedKeysStore.svelte.ts";

    import { getKeyPressAsOptions } from "#utils/view/getKeyPressAsOptions.ts";
    import { getExpertiseDieSize } from "#utils/getExpertiseDieSize.ts";
    import { getDeterministicBonus } from "../../../dice/getDeterministicBonus.ts";
    import { replaceHyphenWithMinusSign } from "#utils/replaceHyphenWithMinusSign.ts";

    type Props = {
        columnFlow: boolean;
        skillKey: string;
        skill: any;
    };

    function getProficiencyLevel() {
        const jackOfAllTrades = flags?.jackOfAllTrades;

        if (skill.proficient === 2) return "expertise";
        if (skill.proficient) return "proficient";
        if (jackOfAllTrades) return "jack";

        return "";
    }

    function getProficiencyTooltip(
        proficiencyLevel: "expertise" | "jack" | "proficient" | string,
    ) {
        switch (proficiencyLevel) {
            case "expertise":
                return "A5E.ProficiencyExpertise";
            case "jack":
                return "A5E.ProficiencyJack";
            case "proficient":
                return "A5E.ProficiencyProficient";
            default:
                return null;
        }
    }

    function updateSkillProficiency() {
        const currentState = skill.proficient;
        let newState: number;

        if (!game.settings.get("a5e", "5eStyleExpertise")) {
            if (currentState) newState = 0;
            else newState = 1;
        } else {
            if (currentState === 2) newState = 0;
            else if (currentState) newState = 2;
            else newState = 1;
        }

        actor.update({ [`system.skills.${skillKey}.proficient`]: newState });
    }

    function getSkillBonus() {
        const skillBonus = skill.deterministicBonus;

        if (showDeterministicBonus) {
            return skillBonus;
        }

        const checkBonus = getDeterministicBonus(
            $actor.BonusesManager.getAbilityBonusesFormula(
                skill.ability,
                "check",
            ),
            actor.getRollData(),
        );
        return skillBonus - checkBonus;
    }

    let { columnFlow, skillKey, skill }: Props = $props();
    const { skills } = CONFIG.A5E;

    let actor: any = getContext("actor");
    let sheetIsLocked: () => boolean = getContext("sheetIsLocked");

    let actorStore = $derived(actor.reactive.system);
    let flags = $derived(actor.reactive.flags?.a5e ?? {});
    const hideExpertiseDice = game.settings.get(
        "a5e",
        "hideExpertiseDice",
    ) as boolean;

    let showDeterministicBonus = $derived(
        flags.includeAbilityModifiersForSkills ?? true,
    );

    let abilityBonus = $derived(actorStore.abilities[skill.ability].check.mod);
    let skillBonus = $derived(getSkillBonus());
    let proficiencyLevel = $derived(getProficiencyLevel());
    let proficiencyTooltip = $derived(getProficiencyTooltip(proficiencyLevel));
</script>

<li class="skill" class:skill--column-flow={columnFlow}>
    <button
        class="a5e-button a5e-button--config skill__proficiency-icon icon"
        class:fa-solid={proficiencyLevel}
        class:fa-regular={!proficiencyLevel}
        class:skill__proficiency-icon--expertise={proficiencyLevel ===
            "expertise"}
        class:skill__proficiency-icon--jack={proficiencyLevel === "jack"}
        class:skill__proficiency-icon--proficient={proficiencyLevel ===
            "proficient"}
        class:skill__proficiency-icon--locked={sheetIsLocked()}
        class:fa-award={proficiencyLevel === "expertise"}
        class:fa-star-half-stroke={proficiencyLevel === "jack"}
        class:fa-star={!proficiencyLevel || proficiencyLevel === "proficient"}
        aria-labelledby="Proficiency Icon"
        data-tooltip={proficiencyTooltip}
        data-tooltip-direction="UP"
        onclick={updateSkillProficiency}
    ></button>

    <button
        id="{actor.id}-{skillKey}-proficient"
        class="a5e-button a5e-button--config icon fa-solid fa-dice-d20 skill__roll-icon"
        class:skill__roll-icon--shift={pressedKeys.Shift}
        class:skill__roll-icon--ctrl={pressedKeys.Control}
        aria-labelledby="Roll Skill Check"
    ></button>

    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <h3
        class="skill__name"
        class:disable-pointer-events={!actor.isOwner}
        onclick={actor.rollSkillCheck(
            skillKey,
            getKeyPressAsOptions(pressedKeys),
        )}
    >
        {skills[skillKey]}

        {#if skill.expertiseDice && !hideExpertiseDice}
            <span class="u-text-xs">
                ({getExpertiseDieSize(skill.expertiseDice, false)})
            </span>
        {/if}
    </h3>

    <div class="skill__mod-wrapper">
        <span class="skill__mod">
            {replaceHyphenWithMinusSign(
                showDeterministicBonus ? skillBonus + abilityBonus : skillBonus,
            )}
        </span>

        {#if flags?.showPassiveScores ?? true}
            <span
                class="skill__passive"
                data-tooltip={localize("A5E.SkillPassiveScore", {
                    skill: skills[skillKey],
                })}
                data-tooltip-direction="UP"
            >
                ({skill.passive})
            </span>
        {/if}
    </div>

    {#if !sheetIsLocked()}
        <button
            class="a5e-button a5e-button--config icon fas fa-cog"
            aria-label={localize("A5E.SkillConfigurationTooltip", {
                skill: skills[skillKey],
            })}
            data-tooltip={localize("A5E.SkillConfigurationTooltip", {
                skill: skills[skillKey],
            })}
            data-tooltip-direction="UP"
            onclick={() => actor.configureSkill({ skillKey })}
        >
        </button>
    {/if}
</li>

<style lang="scss">
    .disable-pointer-events {
        pointer-events: none;
    }

    .skill {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding-inline: 0.5rem;
        margin: 0;
        border: 1px solid var(--a5e-border-color);
        border-top: 0;
        font-family: var(--a5e-font-primary);
        font-size: var(--a5e-sm-text);

        &:nth-child(even) {
            border-left: 0;
            border-right: 0;

            &:nth-last-child(2) {
                border-bottom: 1px solid var(--a5e-border-color);
            }
        }

        &:nth-child(odd) {
            border-left: 0;
        }

        // Select last two elements and remove their bottom border
        &:nth-last-child(-n + 2) {
            border-bottom: 0;
        }

        // Select elements in pairs to produce a striped pattern in the table
        &:nth-child(4n + 1),
        &:nth-child(4n + 2) {
            background: var(--a5e-skill-background-alternate);
        }

        &--column-flow {
            &:nth-child(even) {
                background: var(--a5e-skill-background-alternate);
                border-left: none;
            }

            &:nth-child(odd) {
                background: transparent;
                border-right: none;
            }

            &:nth-child(-n + 10) {
                border-right: 1px solid var(--a5e-border-color);
            }

            &:nth-child(10) {
                border-bottom: none;
            }

            &:nth-child(19) {
                border-bottom: 1px solid var(--a5e-border-color);
            }
        }

        &__mod {
            min-width: 2ch;
        }

        &__mod,
        &__passive {
            display: flex;
            justify-content: center;
        }

        &__mod-wrapper {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        &__name {
            font-size: inherit;
            cursor: pointer;
            flex-grow: 1;
            margin: 0;
            font-weight: normal;
        }

        &__passive {
            color: var(--a5e-text-color-medium);
            min-width: 3ch;
        }

        &__proficiency-icon {
            display: flex;
            color: var(--a5e-button-gray);
            cursor: pointer;

            &--expertise,
            &--proficient {
                color: var(--a5e-skill-proficient-icon-color);
            }

            &--locked {
                cursor: unset;
                pointer-events: none;
            }

            &:has(~ .skill__name:hover) {
                display: none;
            }
        }

        &__proficiency-icon,
        &__roll-icon {
            align-items: center;
            justify-content: center;
            width: 1rem;
        }

        &__roll-icon {
            display: none;
            color: var(--a5e-button-gray);

            &--ctrl {
                color: #ffb63b;
            }

            &--shift {
                color: #488f9a;
            }

            &:has(~ .skill__name:hover) {
                display: flex;
            }
        }
    }
</style>
