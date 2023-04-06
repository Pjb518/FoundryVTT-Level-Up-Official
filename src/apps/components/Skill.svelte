<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import Tag from "./Tag.svelte";

    import pressedKeysStore from "../../stores/pressedKeysStore";

    import getKeyPressAsOptions from "../handlers/getKeyPressAsOptions";
    import getExpertiseDieSize from "../../utils/getExpertiseDieSize";

    export let key;
    export let skill;

    const actor = getContext("actor");
    const label = CONFIG.A5E.skills[key];

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
    {#if !sheetIsLocked}
        <button
            class="fas fa-cog a5e-config-button--skill a5e-button--edit-config"
            on:click={() => $actor.configureSkill({ skillKey: key })}
        />
    {/if}

    {#if skill.proficient}
        <i
            class="fa-solid fa-star fa-sm skill-proficiency-icon"
            data-tooltip="A5E.ProficiencyProficient"
            data-tooltip-direction="UP"
        />
    {:else if jackOfAllTrades}
        <i
            class="fa-solid fa-star-half-stroke fa-sm skill-proficiency-icon"
            data-tooltip="Jack of All Trades"
            data-tooltip-direction="UP"
        />
    {:else}
        <i class="fa-regular fa-star fa-sm skill-proficiency-icon" />
    {/if}

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <h3
        class="u-text-sm"
        class:disable-pointer-events={!$actor.isOwner}
        on:click={$actor.rollSkillCheck(
            key,
            getKeyPressAsOptions($pressedKeysStore)
        )}
    >
        {label}
    </h3>

    {#if skill.expertiseDice}
        <span class="u-text-xs">
            ({getExpertiseDieSize(skill.expertiseDice, false)})
        </span>
    {/if}

    <span>
        {showDeterministicBonus ? skillBonus + abilityBonus : skillBonus}
    </span>
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
    }

    .skill-proficiency-icon {
        color: rgba(0, 0, 0, 0.25);
    }

    .roll-button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 1.5rem;
        height: 1.5rem;
        padding: 0;
        margin: 0;
        background: transparent;
    }
</style>
