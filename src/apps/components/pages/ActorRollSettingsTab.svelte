<script>
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import Checkbox from "../Checkbox.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");

    $: flags = $actor.flags;
</script>

<Section heading="Roll Modifiers" --a5e-section-body-gap="0.75rem">
    <FieldWrapper hint="A5E.settings.hints.halflingLuck">
        <Checkbox
            label="A5E.settings.halflingLuck"
            checked={flags.a5e?.halflingLuck ?? false}
            on:updateSelection={({ detail }) => {
                updateDocumentDataFromField(
                    $actor,
                    "flags.a5e.halflingLuck",
                    detail,
                );
            }}
        />
    </FieldWrapper>

    <FieldWrapper hint="A5E.settings.hints.jackOfAllTrades">
        <Checkbox
            label="A5E.settings.jackOfAllTrades"
            checked={flags.a5e?.jackOfAllTrades ?? false}
            on:updateSelection={({ detail }) => {
                updateDocumentDataFromField(
                    $actor,
                    "flags.a5e.jackOfAllTrades",
                    detail,
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
            value={flags.a5e?.deathSaveThreshold ?? 10}
            on:change={({ target }) => {
                updateDocumentDataFromField(
                    $actor,
                    "flags.a5e.deathSaveThreshold",
                    parseInt(target.value, 10),
                );
            }}
        />

        <label for="{actor.id}-death-save-threshold">
            {localize("A5E.settings.deathSaveThreshold")}
        </label>
    </FieldWrapper>
</Section>
