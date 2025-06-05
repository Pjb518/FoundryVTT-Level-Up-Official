<script lang="ts">
    import { getContext } from "svelte";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    let actor: any = getContext("actor");
    let actorStore = $derived(actor.reactive.system);
</script>

<Section heading="Maneuver Resource Settings" --a5e-section-body-gap="0.75rem">
    <FieldWrapper>
        <Checkbox
            label="A5E.ExertionRecoveryConfigPrompt"
            checked={actorStore.attributes.exertion.recoverOnRest}
            onUpdateSelection={(checked) => {
                updateDocumentDataFromField(
                    actor,
                    "system.attributes.exertion.recoverOnRest",
                    checked,
                );
            }}
        />
    </FieldWrapper>
</Section>
