<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import pressedKeysStore from "../../stores/pressedKeysStore";

    import getKeyPressAsOptions from "../handlers/getKeyPressAsOptions";
    import getExpertiseDieSize from "../../utils/getExpertiseDieSize";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let key;
    export let skill;

    const actor = getContext("actor");
    const { skills } = CONFIG.A5E;

    let showDeterministicBonus =
        $actor.flags?.a5e?.includeAbilityModifiersForSkills ??
        $actor.type === "npc";

    $: abilityBonus =
        $actor.system.abilities[skill.ability].check.deterministicBonus;

    $: jackOfAllTrades = $actor.flags.a5e?.jackOfAllTrades;
    $: skillBonus = skill.deterministicBonus;

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<li class="skill">
    <input
        style="display: none;"
        type="checkbox"
        id="{$actor.id}-{key}-proficient"
        name="system.skills.{key}.proficient"
        checked={skill.proficient}
        disabled={sheetIsLocked}
        on:change={({ target }) =>
            updateDocumentDataFromField($actor, target.name, target.checked)}
    />

    {#if skill.proficient}
        <label
            for="{$actor.id}-{key}-proficient"
            class="fa-solid fa-star skill__proficiency-icon skill__proficiency-icon--proficient"
            class:skill__proficiency-icon--locked={sheetIsLocked}
            data-tooltip="A5E.ProficiencyProficient"
            data-tooltip-direction="UP"
        />
    {:else if jackOfAllTrades}
        <label
            for="{$actor.id}-{key}-proficient"
            class="fa-solid fa-star-half-stroke skill__proficiency-icon skill__proficiency-icon--jack"
            class:skill__proficiency-icon--locked={sheetIsLocked}
            data-tooltip="Jack of All Trades"
            data-tooltip-direction="UP"
        />
    {:else}
        <label
            for="{$actor.id}-{key}-proficient"
            class="fa-regular fa-star skill__proficiency-icon"
            class:skill__proficiency-icon--locked={sheetIsLocked}
        />
    {/if}

    <label
        for="{$actor.id}-{key}-proficient"
        class="fa-solid fa-dice-d20 skill__roll-icon"
        class:skill__roll-icon--shift={$pressedKeysStore.Shift}
        class:skill__roll-icon--ctrl={$pressedKeysStore.Control}
    />

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <h3
        class="skill__name"
        class:disable-pointer-events={!$actor.isOwner}
        on:click={$actor.rollSkillCheck(
            key,
            getKeyPressAsOptions($pressedKeysStore)
        )}
    >
        {skills[key]}

        {#if skill.expertiseDice}
            <span class="u-text-xs">
                ({getExpertiseDieSize(skill.expertiseDice, false)})
            </span>
        {/if}
    </h3>

    <div class="skill__mod-wrapper">
        <span>
            {showDeterministicBonus ? skillBonus + abilityBonus : skillBonus}
        </span>

        {#if $actor.flags.a5e?.showPassiveScores ?? true}
            <span
                class="skill__passive"
                data-tooltip={localize("A5E.SkillPassiveScore", {
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
            data-tooltip={localize("A5E.SkillConfigurationTooltip", {
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
        border: 1px solid #ccc;
        border-top: 0;
        font-size: 0.833rem;

        &:nth-child(even) {
            border-left: 0;
            border-right: 0;

            &:nth-last-child(2) {
                border-bottom: 1px solid #ccc;
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
            background: rgba(0, 0, 0, 0.05);
        }

        &__config-button {
            width: fit-content;
            margin: 0;
            padding: 0;
            background: transparent;
            color: rgba(0, 0, 0, 0.25);

            transition: all 0.15s ease-in-out;

            &:focus,
            &:hover {
                color: #555;
                box-shadow: none;
                transform: scale(1.2);
            }
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
            color: #999;
        }

        &__proficiency-icon {
            display: flex;
            color: rgba(0, 0, 0, 0.25);
            cursor: pointer;

            &--jack,
            &--proficient {
                color: #425f65;
            }

            &--locked {
                cursor: unset;
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
            color: #555;
            transition: all 0.15s ease-in-out;

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
