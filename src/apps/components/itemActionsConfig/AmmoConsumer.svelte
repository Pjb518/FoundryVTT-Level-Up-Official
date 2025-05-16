<script>
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Checkbox from "../Checkbox.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";

    export let consumer;
    export let consumerId;
    export let deleteConsumer;

    const item = getContext("item");
    const actionId = getContext("actionId");

    function updateItemSelection() {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.consumers.${consumerId}.itemId`,
            selectedItem,
        );
    }

    let selectedItem = consumer.itemId;
    $: selectedItem, updateItemSelection();

    $: ammunitionItems = $item.actor
        ? $item.actor.items
              .filter(
                  (i) =>
                      i.type === "object" &&
                      i.system.objectType === "ammunition",
              )
              .map((i) => ({ name: i.name, id: i.id }))
              .sort((a, b) =>
                  a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
              )
        : [];
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

<Section
    --a5e-section-body-direction="row"
    --a5e-section-body-padding="0"
    --a5e-section-body-gap="0.5rem"
>
    <FieldWrapper
        heading="A5E.items.title"
        warning="Item selection will be available when item is on an actor."
        showWarning={!$item.actor}
    >
        {#if $item.actor}
            <select
                id="{actionId}-{consumerId}-item-id"
                class="u-w-fit"
                bind:value={selectedItem}
            >
                <option value="" />
                {#each ammunitionItems as { name, id } (id)}
                    <option value={id} selected={consumer.itemId === id}>
                        {name}
                    </option>
                {/each}
            </select>
        {/if}
    </FieldWrapper>

    {#if $item.actor}
        <FieldWrapper
            heading="A5E.ItemQuantity"
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
</Section>

<FieldWrapper>
    <Checkbox
        label="Delete item when quantity reaches zero"
        checked={consumer.deleteOnZero ?? false}
        on:updateSelection={({ detail }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.consumers.${consumerId}.deleteOnZero`,
                detail,
            )}
    />
</FieldWrapper>
