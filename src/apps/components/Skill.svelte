<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/util/i18n";

    import pressedKeysStore from "../../stores/pressedKeysStore";

    import getKeyPressAsOptions from "../handlers/getKeyPressAsOptions";
    import getExpertiseDieSize from "../../utils/getExpertiseDieSize";
    import getDeterministicBonus from "../../dice/getDeterministicBonus";
    import replaceHyphenWithMinusSign from "../../utils/replaceHyphenWithMinusSign";

    export let columnFlow;
    export let key;
    export let skill;

    function getProficiencyLevel(actor, skill) {
        const jackOfAllTrades = actor.flags.a5e?.jackOfAllTrades;

        if (skill.proficient === 2) return "expertise";
        if (skill.proficient) return "proficient";
        if (jackOfAllTrades) return "jack";
    }

    function getProficiencyTooltip(proficiencyLevel) {
        switch (proficiencyLevel) {
            case "expertise":
                return "A5E.proficiency.expertise";
            case "jack":
                return "A5E.proficiency.jack";
            case "proficient":
                return "A5E.proficiency.proficient";
            default:
                return null;
        }
    }

    function updateSkillProficiency() {
        const currentState = skill.proficient;
        let newState;

        if (!game.settings.get("a5e", "5eStyleExpertise")) {
            if (currentState) newState = 0;
            else newState = 1;
        } else {
            if (currentState === 2) newState = 0;
            else if (currentState) newState = 2;
            else newState = 1;
        }

        $actor.update({ [`system.skills.${key}.proficient`]: newState });
    }

    function getSkillBonus() {
        const skillBonus = skill.deterministicBonus;

        if (showDeterministicBonus) {
            return skillBonus;
        }

        const checkBonus = getDeterministicBonus(
            $actor.BonusesManager.getAbilityBonusesFormula(skill.ability, "check"),
            $actor.getRollData(),
        );
        return skillBonus - checkBonus;
    }

    const actor = getContext("actor");
    const hideExpertiseDice = game.settings.get("a5e", "hideExpertiseDice");
    const { skills } = CONFIG.A5E;

    let showDeterministicBonus =
        $actor.flags?.a5e?.includeAbilityModifiersForSkills ?? true;

    $: abilityBonus = $actor.system.abilities[skill.ability].check.mod;

    $: skillBonus = getSkillBonus($actor, showDeterministicBonus);
    $: proficiencyLevel = getProficiencyLevel($actor, skill);
    $: proficiencyTooltip = getProficiencyTooltip(proficiencyLevel);

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : ($actor.flags?.a5e?.sheetIsLocked ?? true);
</script>

<li class="skill" class:skill--column-flow={columnFlow}>
    <button
        class="skill__proficiency-icon"
        class:fa-solid={proficiencyLevel}
        class:fa-regular={!proficiencyLevel}
        class:skill__proficiency-icon--expertise={proficiencyLevel === "expertise"}
        class:skill__proficiency-icon--jack={proficiencyLevel === "jack"}
        class:skill__proficiency-icon--proficient={proficiencyLevel === "proficient"}
        class:skill__proficiency-icon--locked={sheetIsLocked}
        class:fa-award={proficiencyLevel === "expertise"}
        class:fa-star-half-stroke={proficiencyLevel === "jack"}
        class:fa-star={!proficiencyLevel || proficiencyLevel === "proficient"}
        data-tooltip={proficiencyTooltip}
        data-tooltip-direction="UP"
        on:click={updateSkillProficiency}
    />

    <button
        for="{$actor.id}-{key}-proficient"
        class="fa-solid fa-dice-d20 skill__roll-icon"
        class:skill__roll-icon--shift={$pressedKeysStore.Shift}
        class:skill__roll-icon--ctrl={$pressedKeysStore.Control}
    />

    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
    <h3
        class="skill__name"
        class:disable-pointer-events={!$actor.isOwner}
        on:click={$actor.rollSkillCheck(key, getKeyPressAsOptions($pressedKeysStore))}
    >
        {skills[key]}

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

        {#if $actor.flags.a5e?.showPassiveScores ?? true}
            <span
                class="skill__passive"
                data-tooltip={localize("A5E.skillLabels.passiveScore", {
                    skill: skills[key],
                })}
                data-tooltip-direction="UP"
            >
                ({skill.passive})
            </span>
        {/if}
    </div>

    {#if !sheetIsLocked}
        <button
            class="fas fa-cog skill__config-button"
            data-tooltip={localize("A5E.skillLabels.configurationTooltip", {
                skill: skills[key],
            })}
            data-tooltip-direction="UP"
            on:click={() => $actor.configureSkill({ skillKey: key })}
        />
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
        border: 1px solid var(--a5e-border-color);
        border-top: 0;
        font-family: var(--a5e-font-serif);
        font-size: var(--a5e-text-size-sm);

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

        &__config-button {
            width: fit-content;
            margin: 0;
            padding: 0;
            background: transparent;
            color: var(--a5e-button-gray);

            transition: var(--a5e-transition-standard);

            &:focus,
            &:hover {
                color: var(--a5e-button-gray-hover);
                box-shadow: none;
                transform: scale(1.2);
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
        }

        &__passive {
            color: var(--a5e-color-text-medium);
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
            background: transparent;

            &:focus,
            &:hover {
                box-shadow: none;
            }
        }

        &__roll-icon {
            display: none;
            color: var(--a5e-button-gray);
            transition: var(--a5e-transition-standard);

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
