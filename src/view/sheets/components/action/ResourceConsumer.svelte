<script lang="ts">
    import type { ConsumerProps } from "./data.ts";

    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";

    function updateResourceSelection(value: string) {
        updateDocumentDataFromField(
            item,
            `system.actions.${actionId}.consumers.${consumerId}.resource`,
            value,
        );
    }

    let { consumer, consumerId, deleteConsumer }: ConsumerProps = $props();

    const { resourceConsumerConfig } = CONFIG.A5E;

    const item: any = getContext("item");
    const actionId: string = getContext("actionId");

    let selectedResource: string = $derived(consumer.resource ?? "");
    // $inspect(selectedResource);

    const showFavorPoints =
        (game.settings.get("a5e", "showFavorPoints") as boolean) ?? false;

    if (!showFavorPoints) {
        delete resourceConsumerConfig?.favorPoints;
    }
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

<div class="a5e-action-config__flex-container">
    <FieldWrapper heading="A5E.consumers.resources.title">
        <select
            class="a5e-input a5e-input--slim a5e-input--fit"
            name="{actionId}-{consumerId}-item-id"
            value={selectedResource}
            onchange={({ currentTarget }) => updateResourceSelection(currentTarget.value)}
        >
            <option value=""></option>

            {#each Object.entries(resourceConsumerConfig) as [value, { label }] (value)}
                <option {value}>
                    {localize(label)}
                </option>
            {/each}
        </select>
    </FieldWrapper>

    {#if selectedResource === "classResource"}
        <FieldWrapper heading="Resource Identifier" --a5e-field-wrapper-width="16rem">
            <input
                class="a5e-input a5e-input--slim"
                type="text"
                value={consumer.classIdentifier ?? ""}
                onchange={({ currentTarget }) =>
                    updateDocumentDataFromField(
                        item,
                        `system.actions.${actionId}.consumers.${consumerId}.classIdentifier`,
                        currentTarget.value,
                    )}
            />
        </FieldWrapper>
    {/if}

    {#if resourceConsumerConfig?.[selectedResource]?.type === "value"}
        <FieldWrapper heading="A5E.consumers.value" --a5e-field-wrapper-width="7.5rem">
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
    {/if}
</div>

{#if resourceConsumerConfig?.[selectedResource]?.type === "boolean"}
    <Checkbox
        label="A5E.consumers.restoreResourceOnUse"
        checked={consumer.restore ?? false}
        onUpdateSelection={(value) =>
            updateDocumentDataFromField(
                item,
                `system.actions.${actionId}.consumers.${consumerId}.restore`,
                value,
            )}
    />
{/if}
