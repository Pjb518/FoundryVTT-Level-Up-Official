<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { getContext } from "svelte";
    import A5E from "../../../modules/config";

    import getExpertiseDieSize from "../../../modules/utils/getExpertiseDieSize";

    const actor = getContext("actor");

    const showDeterministicBonus =
        $actor.system.flags?.a5e?.IncludeAbilityModifiersForSkills ??
        $actor.system.type;

    function getBonus(id) {
        const skill = $actor.system.skills[id];
        const skillBonus = skill.deterministicBonus;
        if (!showDeterministicBonus) return skillBonus;
        else
            return (
                skillBonus +
                $actor.system.abilities[skill.ability].check.deterministicBonus
            );
    }

    $: sheetIsLocked = $actor.flags?.a5e?.sheetIsLocked ?? true;
    $: skills = $actor.system.skills;
</script>

<ul class="skills-container">
    <!-- svelte-ignore missing-declaration (CONFIG)-->
    {#each Object.entries(CONFIG.A5E.skills) as [skill, label]}
        <li class="a5e-item a5e-item--skill" data-skill={skill}>
            <span
                class="a5e-skill__value"
                class:a5e-skill__value--green={skills[skill].proficient}
            >
                {getBonus(skill)}
            </span>

            {#if !sheetIsLocked}
                <i
                    class="a5e-config-button a5e-config-button--skill fas fa-gear"
                />
            {/if}

            <div class="u-flex u-flex-col u-gap-xxs u-justify-center">
                <header class="u-align-center u-flex u-gap-xs">
                    <h3 class="u-text-bold u-text-sm">
                        {localize(label)}
                    </h3>

                    {#if skills[skill].expertiseDice}
                        <span class="u-text-xs">
                            ({getExpertiseDieSize(
                                skills[skill].expertiseDice,
                                false
                            )})
                        </span>
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
                    {#if skills[skill].specialties.length}
                        {#each skills[skill].specialties.sort((a, b) => a
                                .toLowerCase()
                                .localeCompare(b.toLowerCase())) as speciality}
                            <li
                                class="a5e-tag a5e-tag--tight"
                                data-speciality={speciality}
                            >
                                {localize(
                                    CONFIG.A5E.skillSpecialties[skill][
                                        speciality
                                    ] ?? speciality
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
    {/each}
</ul>

<style lang="scss">
    .skills-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.25rem;
        margin: 0;
        padding: 0;
        list-style: none;
        overflow-x: auto;
    }
</style>
