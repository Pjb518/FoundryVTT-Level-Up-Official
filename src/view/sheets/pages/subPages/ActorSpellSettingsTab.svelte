<script lang="ts">
    import { getContext } from "svelte";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import Section from "#view/snippets/Section.svelte";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    let actor: any = getContext("actor");
    let actorStore = $derived(actor.reactive.system);
    let flags = $derived(actor.reactive.flags?.a5e ?? {});

    const { abilityAbbreviations } = CONFIG.A5E;
</script>

<Section heading="Spell Resource Settings" --a5e-section-body-gap="0.75rem">
    <FieldWrapper>
        <Checkbox
            label="A5E.settings.restoreSpellSlotsOnShortRest"
            checked={flags?.restoreSpellSlotsOnShortRest ?? false}
            updateSelection={(checked) => {
                updateDocumentDataFromField(
                    actor,
                    "flags.a5e.restoreSpellSlotsOnShortRest",
                    checked,
                );
            }}
        />
    </FieldWrapper>

    <FieldWrapper>
        <Checkbox
            label="A5E.settings.restoreSpellPointsOnShortRest"
            checked={flags?.restoreSpellPointsOnShortRest ?? true}
            updateSelection={(checked) => {
                updateDocumentDataFromField(
                    actor,
                    "flags.a5e.restoreSpellPointsOnShortRest",
                    checked,
                );
            }}
        />
    </FieldWrapper>
</Section>

<Section
    heading="Miscellaneous Spell Settings"
    --a5e-section-body-gap="0.75rem"
>
    <RadioGroup
        heading="A5E.DefaultSpellcastingAbilityScore"
        optionStyles="min-width:2rem; text-align: center;"
        options={Object.entries(abilityAbbreviations)}
        selected={actorStore.attributes.spellcasting}
        onUpdateSelection={(value) =>
            updateDocumentDataFromField(
                actor,
                "system.attributes.spellcasting",
                value,
            )}
    />
</Section>
