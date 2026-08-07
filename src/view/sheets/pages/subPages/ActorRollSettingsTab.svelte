<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    let actor: any = getContext("actor");
    let flags = $derived(actor.reactive.flags?.a5e ?? {});
</script>

<Section heading="Roll Modifiers" --a5e-section-body-gap="0.75rem">
    <FieldWrapper hint="A5E.settings.hints.halflingLuck">
        <Checkbox
            label="A5E.settings.halflingLuck"
            checked={flags.halflingLuck ?? false}
            onUpdateSelection={(checked) => {
                updateDocumentDataFromField(
                    actor,
                    "flags.a5e.halflingLuck",
                    checked,
                );
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.jackOfAllTrades">
        <Checkbox
            label="A5E.settings.jackOfAllTrades"
            checked={flags.jackOfAllTrades ?? false}
            onUpdateSelection={(checked) => {
                updateDocumentDataFromField(
                    actor,
                    "flags.a5e.jackOfAllTrades",
                    checked,
                );
            }}
        />
    </FieldWrapper>

    <FieldWrapper
        hint="A5E.settings.hints.deathSaveThreshold"
        --a5e-field-wrapper-direction="row"
        --a5e-field-wrapper-item-alignment="center"
    >
        <input
            id="{actor.id}-death-save-threshold"
            class="a5e-input a5e-input--small a5e-input--slim"
            type="number"
            min="0"
            max="20"
            value={flags?.deathSaveThreshold ?? 10}
            onchange={({ currentTarget }) => {
                updateDocumentDataFromField(
                    actor,
                    "flags.a5e.deathSaveThreshold",
                    parseInt(currentTarget.value, 10),
                );
            }}
        />

        <label for="{actor.id}-death-save-threshold">
            {localize("A5E.settings.deathSaveThreshold")}
        </label>
    </FieldWrapper>

    <FieldWrapper
        hint="A5E.settings.hints.criticalHitThresholdWeapon"
        --a5e-field-wrapper-direction="row"
        --a5e-field-wrapper-item-alignment="center"
    >
        <input
            id="{actor.id}-critical-hit-threshold-weapon"
            class="a5e-input a5e-input--small a5e-input--slim"
            type="number"
            min="0"
            max="20"
            value={flags?.criticalHitThresholdWeapon ?? 20}
            onchange={({ currentTarget }) => {
                updateDocumentDataFromField(
                    actor,
                    "flags.a5e.criticalHitThresholdWeapon",
                    parseInt(currentTarget.value, 20),
                );
            }}
        />

        <label for="{actor.id}-critical-hit-threshold-weapon">
            {localize("A5E.settings.criticalHitThresholdWeapon")}
        </label>
    </FieldWrapper>

    <FieldWrapper
        hint="A5E.settings.hints.criticalHitThresholdSpell"
        --a5e-field-wrapper-direction="row"
        --a5e-field-wrapper-item-alignment="center"
    >
        <input
            id="{actor.id}-critical-hit-threshold-spell"
            class="a5e-input a5e-input--small a5e-input--slim"
            type="number"
            min="0"
            max="20"
            value={flags?.criticalHitThresholdSpell ?? 20}
            onchange={({ currentTarget }) => {
                updateDocumentDataFromField(
                    actor,
                    "flags.a5e.criticalHitThresholdSpell",
                    parseInt(currentTarget.value, 20),
                );
            }}
        />

        <label for="{actor.id}-critical-hit-threshold-spell">
            {localize("A5E.settings.criticalHitThresholdSpell")}
        </label>
    </FieldWrapper>
</Section>
