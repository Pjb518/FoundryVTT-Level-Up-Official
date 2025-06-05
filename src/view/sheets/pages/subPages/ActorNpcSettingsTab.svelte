<script lang="ts">
    import { getContext } from "svelte";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    let actor: any = getContext("actor");
    let flags = $derived(actor.reactive.flags?.a5e ?? {});
</script>

<Section heading="Token Options" --a5e-section-body-gap="0.75rem">
    <FieldWrapper>
        <Checkbox
            label="Disable Randomized HP Rolls"
            checked={flags.disableRandomizedHP ?? false}
            onUpdateSelection={(checked) => {
                updateDocumentDataFromField(
                    actor,
                    "flags.a5e.disableRandomizedHP",
                    checked,
                );
            }}
        />
    </FieldWrapper>
</Section>
