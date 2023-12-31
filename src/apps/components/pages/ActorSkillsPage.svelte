<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import FormSection from "../FormSection.svelte";
    import Skill from "../Skill.svelte";

    function getSkills(baseSkills) {
        const skills = { ...baseSkills };

        if (game.settings.get("a5e", "hideA5eSkills")) {
            delete skills.cul;
            delete skills.eng;
        }

        return skills;
    }

    function determineWhetherToShowSkillSpecialties(skills) {
        if (game.settings.get("a5e", "hideSkillSpecialties")) return false;

        return Object.values(skills).some((skill) => skill.specialties.length);
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
                {#each Object.entries(skills) as [key, skill]}
                    {#if skill.specialties.length}
                        <dt class="a5e-skill-specialties__skill">
                            {localize(A5E.skills[key])}
                        </dt>
                        <dd class="a5e-skill-specialties__list">
                            {skill.specialties
                                .sort((a, b) =>
                                    a
                                        .toLowerCase()
                                        .localeCompare(b.toLowerCase()),
                                )
                                .map((specialty) => {
                                    if (!skillSpecialties[key])
                                        return specialty;

                                    return (
                                        skillSpecialties[key][specialty] ??
                                        specialty
                                    );
                                })
                                .join(", ")}
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
