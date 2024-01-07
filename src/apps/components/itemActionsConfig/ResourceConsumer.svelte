<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import Checkbox from "../Checkbox.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    export let consumer;
    export let consumerId;
    export let deleteConsumer;

    const item = getContext("item");
    const actionId = getContext("actionId");
    const A5E = CONFIG.A5E;

    function updateResourceSelection() {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.consumers.${consumerId}.resource`,
            selectedResource,
        );
    }

    let selectedResource = consumer.resource ?? "";
    $: selectedResource, updateResourceSelection();
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
        on:change={() =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.consumers.${consumerId}.label`,
            )}
    />
</FieldWrapper>

<div class="a5e-field-group u-flex-row u-gap-md">
    <FieldWrapper heading="A5E.Resource">
        <select
            name="{actionId}-{consumerId}-item-id"
            class="u-w-fit"
            bind:value={selectedResource}
        >
            <option value="" />

            {#each Object.entries(A5E.resourceConsumerConfig) as [value, { label }] (value)}
                <option {value}>
                    {localize(label)}
                </option>
            {/each}
        </select>
    </FieldWrapper>

    {#if A5E.resourceConsumerConfig?.[selectedResource]?.type === "value"}
        <FieldWrapper
            heading="A5E.ConsumeValue"
            --a5e-field-wrapper-width="7.5rem"
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
    {/if}
</div>

{#if A5E.resourceConsumerConfig?.[selectedResource]?.type === "boolean"}
    <Checkbox
        label="A5E.ConsumerRestoreResourceOnUse"
        checked={consumer.restore ?? false}
        on:updateSelection={({ detail }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.consumers.${consumerId}.restore`,
                detail,
            )}
    />
{/if}
