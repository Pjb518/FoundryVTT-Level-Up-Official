<script lang="ts">
    import { getContext } from "svelte";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    type Props = {
        reload?: boolean;
    };

    let { reload = $bindable() }: Props = $props();

    let settings: Record<string, { data: any; value: any }> =
        getContext("settings");
    let updates: Map<string, any> = getContext("updates");

    let showFavorPoints = $derived(settings["showFavorPoints"].value);
    let showVRCImplants = $derived(settings["showVRCImplants"].value);
    let showVRCProficiencies = $derived(settings["showVRCProficiencies"].value);
    let showVRCPsionicDisciplines = $derived(
        settings["showVRCPsionicDisciplines"].value,
    );
    let showVRCSkills = $derived(settings["showVRCSkills"].value);
    let showVRCSpecialties = $derived(settings["showVRCSpecialties"].value);
    let showVRCTechLevel = $derived(settings["showVRCTechLevel"].value);
    let useCredits = $derived(settings["useCredits"].value);
    let usePoSTables = $derived(settings["usePoSTables"].value);
</script>

<Section
    heading="A5E.settings.sectionHeader.pos"
    --a5e-section-body-gap="0.5rem"
>
    <FieldWrapper hint="A5E.settings.hints.usePoSTables">
        <Checkbox
            label="A5E.settings.usePoSTables"
            checked={updates.get("usePoSTables") ?? usePoSTables ?? false}
            onUpdateSelection={(detail) => {
                updates.set("usePoSTables", detail);
                reload = true;
            }}
        />
    </FieldWrapper>
</Section>

<Section
    heading="A5E.settings.sectionHeader.gpg"
    --a5e-section-body-gap="0.5rem"
>
    <FieldWrapper hint="A5E.settings.hints.showFavourPoints">
        <Checkbox
            label="A5E.settings.showFavorPoints"
            checked={updates.get("showFavorPoints") ?? showFavorPoints ?? false}
            onUpdateSelection={(detail) => {
                updates.set("showFavorPoints", detail);
                reload = true;
            }}
        />
    </FieldWrapper>
</Section>

<Section
    heading="A5E.settings.sectionHeader.vrc"
    --a5e-section-body-gap="0.5rem"
>
    <FieldWrapper hint="A5E.settings.hints.showVRCImplants">
        <Checkbox
            label="A5E.settings.showVRCImplants"
            checked={updates.get("showVRCImplants") ?? showVRCImplants ?? false}
            onUpdateSelection={(detail) => {
                updates.set("showVRCImplants", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.showVRCProficiencies">
        <Checkbox
            label="A5E.settings.showVRCProficiencies"
            checked={updates.get("showVRCProficiencies") ??
                showVRCProficiencies ??
                false}
            onUpdateSelection={(detail) => {
                updates.set("showVRCProficiencies", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.showVRCPsionicDisciplines">
        <Checkbox
            label="A5E.settings.showVRCPsionicDisciplines"
            checked={updates.get("showVRCPsionicDisciplines") ??
                showVRCPsionicDisciplines ??
                false}
            onUpdateSelection={(detail) => {
                updates.set("showVRCPsionicDisciplines", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.showVRCSkills">
        <Checkbox
            label="A5E.settings.showVRCSkills"
            checked={updates.get("showVRCSkills") ?? showVRCSkills ?? false}
            onUpdateSelection={(detail) => {
                updates.set("showVRCSkills", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.showVRCSpecialties">
        <Checkbox
            label="A5E.settings.showVRCSpecialties"
            checked={updates.get("showVRCSpecialties") ??
                showVRCSpecialties ??
                false}
            onUpdateSelection={(detail) => {
                updates.set("showVRCSpecialties", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.showVRCTechLevel">
        <Checkbox
            label="A5E.settings.showVRCTechLevel"
            checked={updates.get("showVRCTechLevel") ??
                showVRCTechLevel ??
                false}
            onUpdateSelection={(detail) => {
                updates.set("showVRCTechLevel", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.useCredits">
        <Checkbox
            label="A5E.settings.useCredits"
            checked={updates.get("useCredits") ?? useCredits ?? false}
            onUpdateSelection={(detail) => {
                updates.set("useCredits", detail);
                reload = true;
            }}
        />
    </FieldWrapper>
</Section>
