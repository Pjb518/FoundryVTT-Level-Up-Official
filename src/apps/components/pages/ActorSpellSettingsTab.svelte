<script>
    import { getContext } from "svelte";

    import Checkbox from "../Checkbox.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import Section from "../Section.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");
    const { abilityAbbreviations } = CONFIG.A5E;

    $: flags = $actor.flags?.a5e ?? {};
</script>

<Section
    heading="Spell Resource Settings"
    --a5e-section-body-gap="0.75rem"
    --a5e-section-body-padding="0 0.25rem"
>
    <FieldWrapper>
        <Checkbox
            label="A5E.SpellShowSpellSlots"
            checked={flags?.showSpellSlots ?? true}
            on:updateSelection={({ detail }) => {
                updateDocumentDataFromField(
                    $actor,
                    "flags.a5e.showSpellSlots",
                    detail,
                );
            }}
        />
    </FieldWrapper>

    {#if flags?.showSpellSlots ?? true}
        <FieldWrapper>
            <Checkbox
                label="A5E.settings.restoreSpellSlotsOnShortRest"
                checked={flags?.restoreSpellSlotsOnShortRest ?? false}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.restoreSpellSlotsOnShortRest",
                        detail,
                    );
                }}
            />
        </FieldWrapper>
    {/if}

    <FieldWrapper>
        <Checkbox
            label="A5E.SpellShowSpellPoints"
            checked={flags?.showSpellPoints ?? false}
            on:updateSelection={({ detail }) => {
                updateDocumentDataFromField(
                    $actor,
                    "flags.a5e.showSpellPoints",
                    detail,
                );
            }}
        />
    </FieldWrapper>

    {#if flags?.showSpellPoints ?? false}
        <FieldWrapper>
            <Checkbox
                label="A5E.settings.restoreSpellPointsOnShortRest"
                checked={flags?.restoreSpellPointsOnShortRest ?? true}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.restoreSpellPointsOnShortRest",
                        detail,
                    );
                }}
            />
        </FieldWrapper>
    {/if}
</Section>

<Section
    heading="Miscellaneous Spell Settings"
    --a5e-section-body-gap="0.75rem"
    --a5e-section-body-padding="0 0.25rem"
>
    <FieldWrapper
        heading="A5E.SpellcastingAbilityScore"
        --background="transparent"
        --padding="0.25rem"
    >
        <RadioGroup
            optionStyles="min-width:2rem; text-align: center;"
            options={Object.entries(abilityAbbreviations)}
            selected={$actor.system.attributes.spellcasting}
            on:updateSelection={(event) =>
                updateDocumentDataFromField(
                    $actor,
                    "system.attributes.spellcasting",
                    event.detail,
                )}
        />
    </FieldWrapper>
</Section>
