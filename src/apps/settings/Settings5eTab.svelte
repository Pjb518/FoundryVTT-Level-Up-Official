<script>
    import { getContext } from "svelte";

    import Checkbox from "../components/Checkbox.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";
    import Section from "../components/Section.svelte";

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

<Section
    heading="A5E.settings.sectionHeader.actorBehavior"
    --a5e-section-body-gap="0.5rem"
>
    <FieldWrapper hint="A5E.settings.hints.5eStyleDeathSaves">
        <Checkbox
            label="A5E.settings.5eStyleDeathSaves"
            checked={updates.get("5eStyleDeathSaves") ?? $deathSaves ?? false}
            on:updateSelection={({ detail }) => {
                updates.set("5eStyleDeathSaves", detail);
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.hideA5eSkills">
        <Checkbox
            label="A5E.settings.hideA5eSkills"
            checked={updates.get("hideA5eSkills") ?? $hideA5eSkills ?? false}
            on:updateSelection={({ detail }) => {
                updates.set("hideA5eSkills", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.hideExpertiseDice">
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
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.hideSkillSpecialties">
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
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.replaceFatigueAndStrife">
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
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.simpleInitiative">
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
    </FieldWrapper>
</Section>
