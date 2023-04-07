<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import FormSection from "../FormSection.svelte";
    import Skill from "../Skill.svelte";

    const actor = getContext("actor");
    const { skillSpecialties } = CONFIG.A5E;

    $: skills = $actor.system.skills;

    $: showSpecialties = Object.values(skills).some(
        (skill) => skill.specialties.length
    );
</script>

<div class="skill-page-wrapper">
    {#if showSpecialties}
        <div style="border: 1px solid #ccc; border-radius: 3px;">
            <FormSection heading="Skill Specialties">
                <dl class="skill-specialties">
                    {#each Object.entries(skills) as [key, skill]}
                        {#if skill.specialties.length}
                            <dt>{localize(CONFIG.A5E.skills[key])}</dt>
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
        </div>
    {/if}

    <ul class="skills-container">
        {#each Object.entries(skills) as [key, skill], i}
            <Skill {key} {skill} />
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
        border-radius: 3px;
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
        font-size: 0.833rem;

        &__list {
            margin: 0;
            padding: 0;
        }
    }
</style>
