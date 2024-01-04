<script>
    import { getContext } from "svelte";

    import Checkbox from "../Checkbox.svelte";
    import FormSection from "../LegacyFormSection.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const item = getContext("item");
    const actionId = getContext("actionId");

    export let roll;
    export let rollId;
</script>

<FormSection
    heading="A5E.Label"
    --background="none"
    --direction="column"
    --padding="0"
    --margin="0 4.5rem 0 0"
>
    <input
        type="text"
        value={roll.label ?? ""}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.rolls.${rollId}.label`,
                target.value,
            )}
    />
</FormSection>

<FormSection
    heading="A5E.RollFormula"
    --background="none"
    --direction="column"
    --padding="0"
>
    <input
        type="text"
        value={roll.formula ?? ""}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.rolls.${rollId}.formula`,
                target.value,
            )}
    />
</FormSection>

<Checkbox
    label="A5E.GenericDefaultSelection"
    checked={roll.default ?? true}
    on:updateSelection={({ detail }) => {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.rolls.${rollId}.default`,
            detail,
        );
    }}
/>
