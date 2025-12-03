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

    const { A5E } = CONFIG;
    let { consumer, consumerId, deleteConsumer }: ConsumerProps = $props();

    const item: any = getContext("item");
    const actionId: string = getContext("actionId");

    let selectedItem: string = $state(consumer.itemId);
    let selectedQuality: number = $state(consumer.quality ?? "1");

    let optGroup = $derived(
        item.actor
            ? item.actor.reactive.items.reduce((acc, i) => {
                  if (i.type !== "object") return acc;
                  if (i.reactive.system.objectType === "ammunition") return acc;

                  const type = i.reactive.system.objectType;
                  const data = {
                      name: i.name,
                      id: i.id,
                  };

                  if (acc?.[type]) acc[type].push(data);
                  else acc[type] = [data];

                  return acc;
              }, {})
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
                onchange={({ currentTarget }) => updateItemSelection(currentTarget.value)}
            >
                <option value=""></option>
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

    <FieldWrapper heading="A5E.ItemQuality" --a5e-field-wrapper-width="7.5rem">
        <select
            class="a5e-input a5e-input--slim a5e-input--fit"
            name="{actionId}-{consumerId}-quality"
            value={selectedQuality}
            onchange={({ currentTarget }) =>
                updateDocumentDataFromField(
                    item,
                    `system.actions.${actionId}.consumers.${consumerId}.quality`,
                    currentTarget.value,
                )}
        >
            <option value="0" selectedQuality="0">Repair</option>
            <option value="1" selectedQuality="1">Damage</option>
            <option value="2" selectedQuality="2">Break</option>
        </select>
    </FieldWrapper>
</Section>
