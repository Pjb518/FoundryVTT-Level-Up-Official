<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

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

<Section
    --a5e-section-margin="0"
    --a5e-section-body-direction="row"
    --a5e-section-body-padding="0"
    --a5e-section-body-gap="0.5rem"
>
    <FieldWrapper
        heading="A5E.Item"
        warning="Item selection will be available when item is on an actor."
        showWarning={!$item.actor}
        --a5e-field-wrapper-width={!$item.actor ? "100%" : "fit-content"}
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

    <!-- {#if $item.actor} -->
    <div class="u-flex u-flex-col u-gap-sm u-w-30">
        <h3 class="a5e-field-group__heading">
            {localize("A5E.ItemQuantity")}
        </h3>

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
    </div>
    <!-- {/if} -->
</Section>
