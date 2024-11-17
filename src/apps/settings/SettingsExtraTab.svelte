<script>
    import { getContext } from "svelte";

    import Checkbox from "../components/Checkbox.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";
    import Section from "../components/Section.svelte";

    export let reload;

    const settings = getContext("settings");
    const updates = getContext("updates");

    let showVRCProficiencies = settings.getStore("showVRCProficiencies");
    let showVRCSkills = settings.getStore("showVRCSkills");
    let showVRCSpecialties = settings.getStore("showVRCSpecialties");
    let showVRCTechLevel = settings.getStore("showVRCTechLevel");
</script>

<Section
    heading="A5E.settings.sectionHeader.vrc"
    --a5e-section-body-gap="0.5rem"
>
        <FieldWrapper hint="A5E.settings.hints.showVRCProficiencies">
            <Checkbox
                label="A5E.settings.showVRCProficiencies"
                checked={updates.get("showVRCProficiencies") ??
                    $showVRCProficiencies ??
                    true}
                on:updateSelection={({ detail }) => {
                    updates.set("showVRCProficiencies", detail);
                    reload = true;
                }}
            />
        </FieldWrapper>

        <FieldWrapper hint="A5E.settings.hints.showVRCSkills">
            <Checkbox
                label="A5E.settings.showVRCSkills"
                checked={updates.get("showVRCSkills") ??
                    $showVRCSkills ??
                    true}
                on:updateSelection={({ detail }) => {
                    updates.set("showVRCSkills", detail);
                    reload = true;
                }}
            />
        </FieldWrapper>

        <FieldWrapper hint="A5E.settings.hints.showVRCSpecialties">
            <Checkbox
                label="A5E.settings.showVRCSpecialties"
                checked={updates.get("showVRCSpecialties") ??
                    $showVRCSpecialties ??
                    true}
                on:updateSelection={({ detail }) => {
                    updates.set("showVRCSpecialties", detail);
                    reload = true;
                }}
            />
        </FieldWrapper>

        <FieldWrapper hint="A5E.settings.hints.showVRCTechLevel">
            <Checkbox
                label="A5E.settings.showVRCTechLevel"
                checked={updates.get("showVRCTechLevel") ??
                    $showVRCTechLevel ??
                    true}
                on:updateSelection={({ detail }) => {
                    updates.set("showVRCTechLevel", detail);
                    reload = true;
                }}
            />
        </FieldWrapper>
</Section>
