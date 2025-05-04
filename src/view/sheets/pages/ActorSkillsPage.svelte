<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import Skill from "../components/Skill.svelte";

    function determineWhetherToShowSkillSpecialties(skills: any) {
        if (game.settings.get("a5e", "hideSkillSpecialties")) return false;

        return Object.values(skills).some(
            (skill: any) => skill.specialties.length,
        );
    }

    function getSkills(baseSkills: any) {
        const skills = { ...baseSkills };

        if (game.settings.get("a5e", "hideA5eSkills")) {
            delete skills.cul;
            delete skills.eng;
        }

        if (!game.settings.get("a5e", "showVRCSkills")) {
            delete skills.sci;
        }

        return skills;
    }

    function getSkillSpecialties(skillKey: string, skill: any): string[] {
        const specialties = skill.specialties;

        if (!Array.isArray(specialties) || !specialties?.length) return [];

        return specialties
            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
            .map((specialty) => {
                if (!skillSpecialties[skillKey]) return specialty;

                return skillSpecialties[skillKey][specialty] ?? specialty;
            });
    }

    function rollSkillCheckWithSpecialty(skillKey: string) {
        const baseExpertiseDice = actor.system.skills[skillKey].expertiseDice;

        actor.rollSkillCheck(skillKey, {
            expertiseDice: baseExpertiseDice + 1,
        });
    }

    let actor: any = getContext("actor");
    let sheetIsLocked: () => boolean = getContext("sheetIsLocked");

    let actorStore = $derived(actor.reactive.system);
    const { A5E } = CONFIG;
    const { skillSpecialties } = A5E;

    let skills = $derived(actorStore.skills);
    let showSpecialties = $derived(
        determineWhetherToShowSkillSpecialties(skills),
    );

    let skillListFlowDirection = $derived(
        game.settings.get("a5e", "skillListFlowDirection"),
    ) as string;
</script>

<div class="skill-page-wrapper">
    {#if showSpecialties}{/if}

    <ul
        class="skills-container"
        class:skills-container--column-flow={skillListFlowDirection ===
            "column"}
    >
        {#each Object.entries(skills) as [skillKey, skill], idx}
            <Skill
                {skillKey}
                {skill}
                columnFlow={skillListFlowDirection === "column"}
            />
        {/each}
    </ul>
</div>

<style lang="scss">
    .a5e-skill-specialties-heading {
        font-family: var(--a5e-font-primary);
        font-size: var(--a5e-md-text);
        font-weight: 700;
    }

    .skills-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-auto-rows: 1.5rem;
        margin: 0;
        padding: 0;
        list-style: none;
        border: 1px solid var(--a5e-border-color);
        border-radius: var(--a5e-border-radius-standard);

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
    }
</style>
