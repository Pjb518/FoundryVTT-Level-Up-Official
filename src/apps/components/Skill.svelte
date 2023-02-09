<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { getContext } from "svelte";

    import getExpertiseDieSize from "../../modules/utils/getExpertiseDieSize";
    import SkillConfigDialog from "../dialogs/initializers/SkillConfigDialog";

    export let jackOfAllTrades;
    export let key;
    export let skill;

    const actor = getContext("actor");
    const label = CONFIG.A5E.skills[key];

    const showDeterministicBonus =
        $actor.flags?.a5e?.includeAbilityModifiersForSkills ??
        $actor.system.type;

    function configureSkill(skill, label) {
        const dialog = new SkillConfigDialog(actor, skill, label);
        dialog.render(true);
    }

    $: abilityBonus =
        $actor.system.abilities[skill.ability].check.deterministicBonus;

    $: skillBonus = skill.deterministicBonus;
    $: sheetIsLocked = $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<li class="a5e-item a5e-item--skill" data-skill={skill}>
    <span
        class="a5e-skill__value"
        class:a5e-skill__value--green={skill.proficient}
    >
        {showDeterministicBonus ? skillBonus + abilityBonus : skillBonus}
    </span>

    {#if !sheetIsLocked}
        <button
            class="fas fa-cog a5e-config-button--skill a5e-button--edit-config"
            on:click={() => configureSkill(key, label)}
        />
    {/if}

    <div class="u-flex u-flex-col u-gap-xxs u-justify-center">
        <header class="u-align-center u-flex u-gap-xs">
            <h3 class="u-text-bold u-text-sm">
                {localize(label)}
            </h3>

            {#if skill.expertiseDice}
                <span class="u-text-xs">
                    ({getExpertiseDieSize(skill.expertiseDice, false)})
                </span>
            {/if}

            {#if skill.proficient}
                <i
                    class="fa-solid fa-star fa-sm skill-proficiency-icon"
                    data-tooltip="A5E.ProficiencyProficient"
                    data-tooltip-direction="DOWN"
                />
            {:else if jackOfAllTrades}
                <i
                    class="fa-solid fa-star-half-stroke fa-sm skill-proficiency-icon"
                    data-tooltip="Jack of All Trades"
                    data-tooltip-direction="DOWN"
                />
            {/if}
        </header>

        <ul
            class="
                u-flex
                u-flex-wrap
                u-font-san-serif
                u-list-style-none
                u-m-0
                u-p-0
                u-text-xxs
                u-gap-xs
                "
        >
            {#if skill.specialties.length}
                {#each skill.specialties.sort((a, b) => a
                        .toLowerCase()
                        .localeCompare(b.toLowerCase())) as specialty}
                    <li
                        class="a5e-tag a5e-tag--tight"
                        data-specialty={specialty}
                    >
                        {localize(
                            CONFIG.A5E.skillSpecialties[key][specialty] ??
                                specialty
                        )}
                    </li>
                {/each}
            {:else}
                <li
                    class="u-border u-border-transparent u-py-xxxs u-text-medium"
                >
                    {localize("A5E.SkillNoSpecialties")}
                </li>
            {/if}
        </ul>
    </div>
</li>

<style lang="scss">
    .skill-proficiency-icon {
        color: rgba(0, 0, 0, 0.25);
    }
</style>
