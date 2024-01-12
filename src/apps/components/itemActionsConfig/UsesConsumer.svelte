<script>
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

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
            classes: "fa-solid fa-trash",
            handler: () => deleteConsumer(actionId, consumerId),
        },
    ]}
    --a5e-header-button-color="rgba(0, 0, 0, 0.2)"
    --a5e-header-button-color-hover="#555"
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
