<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import FormSection from "../LegacyFormSection.svelte";
    import Skill from "../Skill.svelte";

    function determineWhetherToShowSkillSpecialties(skills) {
        if (game.settings.get("a5e", "hideSkillSpecialties")) return false;

        return Object.values(skills).some((skill) => skill.specialties.length);
    }

    function getSkills(baseSkills) {
        const skills = { ...baseSkills };

        if (game.settings.get("a5e", "hideA5eSkills")) {
            delete skills.cul;
            delete skills.eng;
        }

        return skills;
    }

    function getSkillSpecialties(skillKey, skill) {
        const specialties = skill.specialties;

        if (!Array.isArray(specialties) || !specialties?.length) return [];

        return specialties
            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
            .map((specialty) => {
                if (!skillSpecialties[skillKey]) return specialty;

                return skillSpecialties[skillKey][specialty] ?? specialty;
            });
    }

    function rollSkillCheckWithSpecialty(skillKey) {
        const baseExpertiseDice = $actor.system.skills[skillKey].expertiseDice;

        $actor.rollSkillCheck(skillKey, {
            expertiseDice: baseExpertiseDice + 1,
        });
    }

    const actor = getContext("actor");
    const { A5E } = CONFIG;
    const { skillSpecialties } = A5E;

    $: skills = getSkills($actor.system.skills);
    $: showSpecialties = determineWhetherToShowSkillSpecialties(skills);

    $: skillListFlowDirection = game.settings.get(
        "a5e",
        "skillListFlowDirection",
    );
</script>

<div class="skill-page-wrapper">
    {#if showSpecialties}
        <FormSection --border="1px solid #ccc">
            <h3 class="a5e-skill-specialties-heading">Skill Specialties</h3>

            <dl class="a5e-skill-specialties">
                {#each Object.entries(skills) as [skillKey, skill]}
                    {@const specialties = getSkillSpecialties(skillKey, skill)}
                    {@const skillName = localize(A5E.skills[skillKey])}

                    {#if specialties.length}
                        <dt class="a5e-skill-specialties__skill">
                            {skillName}
                        </dt>

                        <dd class="a5e-skill-specialties__list">
                            {#each specialties as specialty}
                                <button
                                    class="a5e-skill-specialties__list-item"
                                    data-tooltip="Roll {skillName} check with {specialty} specialty"
                                    data-tooltip-direction="UP"
                                    on:click={() =>
                                        rollSkillCheckWithSpecialty(skillKey)}
                                >
                                    {specialty}
                                </button>
                            {/each}
                        </dd>
                    {/if}
                {/each}
            </dl>
        </FormSection>
    {/if}

    <ul
        class="skills-container"
        class:skills-container--column-flow={skillListFlowDirection ===
            "column"}
    >
        {#each Object.entries(skills) as [key, skill], i}
            <Skill
                {key}
                {skill}
                columnFlow={skillListFlowDirection === "column"}
            />
        {/each}
    </ul>
</div>

<style lang="scss">
    .a5e-skill-specialties-heading {
        font-family: var(--a5e-font-serif);
        font-size: var(--a5e-text-size-md);
        font-weight: 700;
    }

    .skills-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-auto-rows: 1.5rem;
        margin: 0;
        padding: 0;
        list-style: none;
        border: 1px solid #ccc;
        border-radius: $border-radius-standard;

        &--column-flow {
            grid-template-rows: repeat(10, 1.5rem);
            grid-auto-flow: column;
        }
    }

    .skill-page-wrapper {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        gap: 0.5rem;
        overflow-x: hidden;
    }
</style>
