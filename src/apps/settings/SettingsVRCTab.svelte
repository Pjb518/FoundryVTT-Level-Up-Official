<script>
    import { getContext } from "svelte";

    import Checkbox from "../components/Checkbox.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";
    import Section from "../components/Section.svelte";

    export let reload;

    const settings = getContext("settings");
    const updates = getContext("updates");

    let hideVRCProficiencies = settings.getStore("hideVRCProficiencies");
    let hideVRCSkills = settings.getStore("hideVRCSkills");
    let hideVRCSpecialties = settings.getStore("hideVRCSpecialties");
</script>

<Section
    heading="A5E.settings.sectionHeader.actorBehavior"
    --a5e-section-body-gap="0.5rem"
>
        <FieldWrapper hint="A5E.settings.hints.hideVRCProficiencies">
            <Checkbox
                label="A5E.settings.hideVRCProficiencies"
                checked={updates.get("hideVRCProficiencies") ??
                    $hideVRCProficiencies ??
                    true}
                on:updateSelection={({ detail }) => {
                    updates.set("hideVRCProficiencies", detail);
                    reload = true;
                }}
            />
        </FieldWrapper>

        <FieldWrapper hint="A5E.settings.hints.hideVRCSkills">
            <Checkbox
                label="A5E.settings.hideVRCSkills"
                checked={updates.get("hideVRCSkills") ??
                    $hideVRCSkills ??
                    true}
                on:updateSelection={({ detail }) => {
                    updates.set("hideVRCSkills", detail);
                    reload = true;
                }}
            />
        </FieldWrapper>

        <FieldWrapper hint="A5E.settings.hints.hideVRCSpecialties">
            <Checkbox
                label="A5E.settings.hideVRCSpecialties"
                checked={updates.get("hideVRCSpecialties") ??
                    $hideVRCSpecialties ??
                    true}
                on:updateSelection={({ detail }) => {
                    updates.set("hideVRCSpecialties", detail);
                    reload = true;
                }}
            />
        </FieldWrapper>
</Section>
