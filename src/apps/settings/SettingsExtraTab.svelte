<script>
    import { getContext } from "svelte";

    import Checkbox from "../components/Checkbox.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";
    import Section from "../components/Section.svelte";

    export let reload;

    const settings = getContext("settings");
    const updates = getContext("updates");

    let showFavorPoints = settings.getStore("showFavorPoints");
    let showVRCImplants = settings.getStore("showVRCImplants");
    let showVRCProficiencies = settings.getStore("showVRCProficiencies");
    let showVRCSkills = settings.getStore("showVRCSkills");
    let showVRCSpecialties = settings.getStore("showVRCSpecialties");
    let showVRCTechLevel = settings.getStore("showVRCTechLevel");
    let useCredits = settings.getStore("useCredits");
    let usePoSTables = settings.getStore("usePoSTables");
</script>

<Section heading="A5E.settings.sectionHeader.pos" --a5e-section-body-gap="0.5rem">
    <FieldWrapper hint="A5E.settings.hints.usePoSTables">
        <Checkbox
            label="A5E.settings.usePoSTables"
            checked={updates.get("usePoSTables") ?? $usePoSTables ?? false}
            on:updateSelection={({ detail }) => {
                updates.set("usePoSTables", detail);
                reload = true;
            }}
        />
    </FieldWrapper>
</Section>

<Section heading="A5E.settings.sectionHeader.gpg" --a5e-section-body-gap="0.5rem">
    <FieldWrapper hint="A5E.settings.hints.showFavourPoints">
        <Checkbox
            label="A5E.settings.showFavorPoints"
            checked={updates.get("showFavorPoints") ?? $showFavorPoints ?? false}
            on:updateSelection={({ detail }) => {
                updates.set("showFavorPoints", detail);
                reload = true;
            }}
        />
    </FieldWrapper>
</Section>

<Section heading="A5E.settings.sectionHeader.vrc" --a5e-section-body-gap="0.5rem">
    <FieldWrapper hint="A5E.settings.hints.showVRCImplants">
        <Checkbox
            label="A5E.settings.showVRCImplants"
            checked={updates.get("showVRCImplants") ?? $showVRCImplants ?? false}
            on:updateSelection={({ detail }) => {
                updates.set("showVRCImplants", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.showVRCProficiencies">
        <Checkbox
            label="A5E.settings.showVRCProficiencies"
            checked={updates.get("showVRCProficiencies") ??
                $showVRCProficiencies ??
                false}
            on:updateSelection={({ detail }) => {
                updates.set("showVRCProficiencies", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.showVRCSkills">
        <Checkbox
            label="A5E.settings.showVRCSkills"
            checked={updates.get("showVRCSkills") ?? $showVRCSkills ?? false}
            on:updateSelection={({ detail }) => {
                updates.set("showVRCSkills", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.showVRCSpecialties">
        <Checkbox
            label="A5E.settings.showVRCSpecialties"
            checked={updates.get("showVRCSpecialties") ?? $showVRCSpecialties ?? false}
            on:updateSelection={({ detail }) => {
                updates.set("showVRCSpecialties", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.showVRCTechLevel">
        <Checkbox
            label="A5E.settings.showVRCTechLevel"
            checked={updates.get("showVRCTechLevel") ?? $showVRCTechLevel ?? false}
            on:updateSelection={({ detail }) => {
                updates.set("showVRCTechLevel", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.useCredits">
        <Checkbox
            label="A5E.settings.useCredits"
            checked={updates.get("useCredits") ?? $useCredits ?? false}
            on:updateSelection={({ detail }) => {
                updates.set("useCredits", detail);
                reload = true;
            }}
        />
    </FieldWrapper>
</Section>
