<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/util/i18n";

    import Checkbox from "../Checkbox.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    export let consumer;
    export let consumerId;
    export let deleteConsumer;

    const item = getContext("item");
    const actionId = getContext("actionId");
    const A5E = CONFIG.A5E;
    const { resourceConsumerConfig } = A5E;

    const showFavorPoints = game.settings.get("a5e", "showFavorPoints") ?? false;
    if (!showFavorPoints) {
        delete resourceConsumerConfig?.favorPoints;
    }

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

<div class="a5e-field-group u-flex-row u-gap-md">
    <FieldWrapper heading="A5E.consumers.resources.title">
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

    {#if selectedResource === "classResource"}
        <FieldWrapper heading="Resource Identifier" --a5e-field-wrapper-width="16rem">
            <input
                class="a5e-input a5e-input--slim"
                type="text"
                value={consumer.classIdentifier ?? ""}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        `system.actions.${actionId}.consumers.${consumerId}.classIdentifier`,
                        target.value,
                    )}
            />
        </FieldWrapper>
    {/if}

    {#if A5E.resourceConsumerConfig?.[selectedResource]?.type === "value"}
        <FieldWrapper heading="A5E.consumers.value" --a5e-field-wrapper-width="7.5rem">
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
        label="A5E.consumers.restoreResourceOnUse"
        checked={consumer.restore ?? false}
        on:updateSelection={({ detail }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.consumers.${consumerId}.restore`,
                detail,
            )}
    />
{/if}
