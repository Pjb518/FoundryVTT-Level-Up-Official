<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import FormSection from "../components/LegacyFormSection.svelte";
    import Checkbox from "../components/Checkbox.svelte";

    export let reload;

    const settings = getContext("settings");
    const updates = getContext("updates");

    let deathSaves = settings.getStore("5eStyleDeathSaves");
    let exhaustion = settings.getStore("replaceFatigueAndStrife");
    let hideA5eSkills = settings.getStore("hideA5eSkills");
    let hideExpertiseDice = settings.getStore("hideExpertiseDice");
    let hideSkillSpecialties = settings.getStore("hideSkillSpecialties");
    let simpleInitiative = settings.getStore("simpleInitiative");
</script>

<section class="setting-group">
    <header class="setting-header">
        <h3 class="setting-heading">
            {localize("A5E.settings.sectionHeader.actorBehavior")}
        </h3>
    </header>

    <FormSection hint="A5E.settings.hints.5eStyleDeathSaves" --gap="0.25rem">
        <Checkbox
            label="A5E.settings.5eStyleDeathSaves"
            checked={updates.get("5eStyleDeathSaves") ?? $deathSaves ?? false}
            on:updateSelection={({ detail }) => {
                updates.set("5eStyleDeathSaves", detail);
            }}
        />
    </FormSection>

    <FormSection hint="A5E.settings.hints.hideA5eSkills" --gap="0.25rem">
        <Checkbox
            label="A5E.settings.hideA5eSkills"
            checked={updates.get("hideA5eSkills") ?? $hideA5eSkills ?? false}
            on:updateSelection={({ detail }) => {
                updates.set("hideA5eSkills", detail);
                reload = true;
            }}
        />
    </FormSection>

    <FormSection hint="A5E.settings.hints.hideExpertiseDice" --gap="0.25rem">
        <Checkbox
            label="A5E.settings.hideExpertiseDice"
            checked={updates.get("hideExpertiseDice") ??
                $hideExpertiseDice ??
                false}
            on:updateSelection={({ detail }) => {
                updates.set("hideExpertiseDice", detail);
                reload = true;
            }}
        />
    </FormSection>

    <FormSection hint="A5E.settings.hints.hideSkillSpecialties" --gap="0.25rem">
        <Checkbox
            label="A5E.settings.hideSkillSpecialties"
            checked={updates.get("hideSkillSpecialties") ??
                $hideSkillSpecialties ??
                false}
            on:updateSelection={({ detail }) => {
                updates.set("hideSkillSpecialties", detail);
                reload = true;
            }}
        />
    </FormSection>

    <FormSection
        hint="A5E.settings.hints.replaceFatigueAndStrife"
        --gap="0.25rem"
    >
        <Checkbox
            label="A5E.settings.replaceFatigueAndStrife"
            checked={updates.get("replaceFatigueAndStrife") ??
                $exhaustion ??
                false}
            on:updateSelection={({ detail }) => {
                updates.set("replaceFatigueAndStrife", detail);
                reload = true;
            }}
        />
    </FormSection>

    <FormSection hint="A5E.settings.hints.simpleInitiative" --gap="0.25rem">
        <Checkbox
            label="A5E.settings.simpleInitiative"
            checked={updates.get("simpleInitiative") ??
                $simpleInitiative ??
                false}
            on:updateSelection={({ detail }) => {
                updates.set("simpleInitiative", detail);
                reload = true;
            }}
        />
    </FormSection>
</section>

<style lang="scss">
    .setting-group {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        &:not(:last-child) {
            margin-bottom: 0.25rem;
        }
    }

    .setting-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.5rem 0.25rem 0.125rem;
        border-bottom: 1px solid #ccc;
    }

    // .setting-header-button {
    //     width: fit-content;
    //     padding: 0;
    //     margin: 0;
    //     background: transparent;
    //     line-height: 1;
    //     font-size: $font-size-sm;
    //     color: #7e7960;

    //     transition: $standard-transition;

    //     &:focus,
    //     &:hover {
    //         box-shadow: none;
    //         color: rgb(25, 24, 19);
    //     }
    // }

    .setting-heading {
        font-size: $font-size-sm;
        white-space: nowrap;
    }
</style>
