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
    const A5E = CONFIG.A5E;

    function updateItemSelection() {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.consumers.${consumerId}.itemId`,
            selectedItem,
        );
    }

    let selectedItem = consumer.itemId ?? "";
    $: selectedItem, updateItemSelection();
    $: optGroup = $item.actor
        ? $item.actor.items.reduce((acc, i) => {
              if (i.type !== "object") return acc;
              if (i.system.objectType === "ammunition") return acc;

              const type = i.system.objectType;
              const data = {
                  name: i.name,
                  id: i.id,
              };

              if (acc?.[type]) acc[type].push(data);
              else acc[type] = [data];

              return acc;
          }, {})
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
    >
        {#if $item.actor}
            <select
                id="{actionId}-{consumerId}-item-id"
                class="u-w-fit"
                bind:value={selectedItem}
            >
                <option value="" />
                {#each Object.entries(optGroup) as [type, objects]}
                    <optgroup label={localize(A5E.objectTypesPlural[type])}>
                        {#each objects.sort((a, b) => a.name
                                .toLowerCase()
                                .localeCompare(b.name.toLowerCase())) as { name, id } (id)}
                            <option value={id} selected={consumer.itemId}>
                                {name}
                            </option>
                        {/each}
                    </optgroup>
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
