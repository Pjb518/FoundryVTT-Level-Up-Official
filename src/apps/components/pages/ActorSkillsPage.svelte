<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import FormSection from "../FormSection.svelte";
    import Skill from "../Skill.svelte";

    const actor = getContext("actor");
    const { A5E } = CONFIG;
    const { skillSpecialties } = A5E;

    $: skills = $actor.system.skills;

    $: showSpecialties = Object.values(skills).some(
        (skill) => skill.specialties.length
    );

    $: skillListFlowDirection = game.settings.get(
        "a5e",
        "skillListFlowDirection"
    );
</script>

<div class="skill-page-wrapper">
    {#if showSpecialties}
        <FormSection heading="Skill Specialties" --border="1px solid #ccc">
            <dl class="skill-specialties">
                {#each Object.entries(skills) as [key, skill]}
                    {#if skill.specialties.length}
                        <dt class="skill-specialties__skill">
                            {localize(A5E.skills[key])}
                        </dt>
                        <dd class="skill-specialties__list">
                            {skill.specialties
                                .sort((a, b) =>
                                    a
                                        .toLowerCase()
                                        .localeCompare(b.toLowerCase())
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

    .skill-specialties {
        display: grid;
        align-items: center;
        grid-template-columns: min-content 1fr;
        width: 100%;
        gap: 0.25rem 0.5rem;
        margin: 0;
        font-size: $font-size-sm;

        &__list {
            margin: 0;
            padding: 0;
        }

        &__skill {
            white-space: nowrap;
        }
    }
</style>
