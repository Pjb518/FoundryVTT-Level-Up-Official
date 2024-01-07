<script>
    import { getContext } from "svelte";

    import Checkbox from "../Checkbox.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");

    $: flags = $actor.flags;
</script>

<Section heading="Token Options" --a5e-section-body-gap="0.75rem">
    <FieldWrapper>
        <Checkbox
            label="Disable Randomized HP Rolls"
            checked={flags.a5e?.disableRandomizedHP ?? false}
            on:updateSelection={({ detail }) => {
                updateDocumentDataFromField(
                    $actor,
                    "flags.a5e.disableRandomizedHP",
                    detail,
                );
            }}
        />
    </FieldWrapper>
</Section>
