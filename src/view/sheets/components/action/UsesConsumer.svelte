<script lang="ts">
    import type { ConsumerProps } from "./data.ts";

    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";

    let { consumer, consumerId, deleteConsumer }: ConsumerProps = $props();

    const item: any = getContext("item");
    const actionId: string = getContext("actionId");
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
        class="a5e-input a5e-input--slim"
        type="text"
        value={consumer.label ?? ""}
        onchange={({ currentTarget }) =>
            updateDocumentDataFromField(
                item,
                `system.actions.${actionId}.consumers.${consumerId}.label`,
                currentTarget.value,
            )}
    />
</FieldWrapper>

<FieldWrapper>
    <Checkbox
        label="Select Consumer Automatically in Roll Prompt"
        checked={consumer.default ?? true}
        onUpdateSelection={(value) =>
            updateDocumentDataFromField(
                item,
                `system.actions.${actionId}.consumers.${consumerId}.default`,
                value,
            )}
    />
</FieldWrapper>

<FieldWrapper heading="Default Consumption Amount">
    <input
        class="a5e-input a5e-input--slim a5e-input--small"
        type="number"
        value={consumer.quantity ?? 1}
        onchange={({ currentTarget }) =>
            updateDocumentDataFromField(
                item,
                `system.actions.${actionId}.consumers.${consumerId}.quantity`,
                Number(currentTarget.value),
            )}
    />
</FieldWrapper>
