<script>
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Checkbox from "../Checkbox.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";

    export let consumer;
    export let consumerId;
    export let deleteConsumer;

    const item = getContext("item");
    const actionId = getContext("actionId");
</script>

<FieldWrapper
    heading="A5E.Label"
    buttons={[
        {
            classes: "icon fa-solid fa-trash",
            handler: () => deleteConsumer(actionId, consumerId),
        },
    ]}
>
    <input
        type="text"
        value={consumer.label ?? ""}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.consumers.${consumerId}.label`,
                target.value,
            )}
    />
</FieldWrapper>

<FieldWrapper>
    <Checkbox
        label="Select Consumer Automatically in Roll Prompt"
        checked={consumer.default ?? true}
        on:updateSelection={({ detail }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.consumers.${consumerId}.default`,
                detail,
            )}
    />
</FieldWrapper>

<FieldWrapper
    heading="Default Consumption Amount"
    --a5e-field-wrapper-width="14rem"
>
    <input
        type="number"
        d-type="Number"
        value={consumer.quantity ?? 1}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.consumers.${consumerId}.quantity`,
                Number(target.value),
            )}
    />
</FieldWrapper>
