<script>
    import { getContext } from "svelte";

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
</Section>
