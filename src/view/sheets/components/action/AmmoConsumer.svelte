<script lang="ts">
    import type { ConsumerProps } from "./data.ts";

    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    function updateItemSelection(value: string) {
        updateDocumentDataFromField(
            item,
            `system.actions.${actionId}.consumers.${consumerId}.itemId`,
            value,
        );
    }

    let { consumer, consumerId, deleteConsumer }: ConsumerProps = $props();

    const item: any = getContext("item");
    const actionId: string = getContext("actionId");

    let selectedItem: string = $state(consumer.itemId);

    let ammunitionItems = $derived(
        item.actor
            ? item.actor.reactive.items
                  .filter(
                      (i: any) =>
                          i.reactive.type === "object" &&
                          i.reactive.system.objectType === "ammunition",
                  )
                  .map((i) => ({ name: i.name, id: i.id }))
                  .sort((a, b) =>
                      a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
                  )
            : [],
    );
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

<Section
    --a5e-section-body-direction="row"
    --a5e-section-body-padding="0"
    --a5e-section-body-gap="0.5rem"
>
    <FieldWrapper
        heading="A5E.items.title"
        warning="Item selection will be available when item is on an actor."
        showWarning={!item.actor}
    >
        {#if item.actor}
            <select
                class="a5e-input a5e-input--slim a5e-input--fit"
                id="{actionId}-{consumerId}-item-id"
                value={selectedItem}
                onchange={({ currentTarget }) =>
                    updateItemSelection(currentTarget.value)}
            >
                <option value=""></option>
                {#each ammunitionItems as { name, id } (id)}
                    <option value={id} selected={consumer.itemId === id}>
                        {name}
                    </option>
                {/each}
            </select>
        {/if}
    </FieldWrapper>

    {#if item.actor}
        <FieldWrapper
            heading="A5E.ItemQuantity"
            --a5e-field-wrapper-width="7.5rem"
        >
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
</Section>

<FieldWrapper>
    <Checkbox
        label="Delete item when quantity reaches zero"
        checked={consumer.deleteOnZero ?? false}
        onUpdateSelection={(value) =>
            updateDocumentDataFromField(
                item,
                `system.actions.${actionId}.consumers.${consumerId}.deleteOnZero`,
                value,
            )}
    />
</FieldWrapper>
