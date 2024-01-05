<script>
    import { getContext } from "svelte";

    import Checkbox from "../Checkbox.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");
</script>

<Section
    heading="Maneuver Resource Settings"
    --a5e-section-body-gap="0.75rem"
    --a5e-section-body-padding="0 0.25rem"
>
    <FieldWrapper>
        <Checkbox
            label="A5E.ExertionRecoveryConfigPrompt"
            checked={$actor.system.attributes.exertion.recoverOnRest}
            on:updateSelection={({ detail }) => {
                updateDocumentDataFromField(
                    $actor,
                    "system.attributes.exertion.recoverOnRest",
                    detail,
                );
            }}
        />
    </FieldWrapper>
</Section>
