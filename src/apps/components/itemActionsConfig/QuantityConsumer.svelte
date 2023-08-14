<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    export let consumer;
    export let consumerId;

    const item = getContext("item");
    const actionId = getContext("actionId");
    const A5E = CONFIG.A5E;

    function updateItemSelection() {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.consumers.${consumerId}.itemId`,
            selectedItem
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

<section class="action-config__wrapper">
    <div class="a5e-field-group a5e-field-group--label">
        <label for="{actionId}-{consumerId}-label">
            {localize("A5E.Label")}
        </label>

        <input
            id="{actionId}-{consumerId}-label"
            name="{actionId}-{consumerId}-label"
            type="text"
            value={consumer.label ?? ""}
            on:change={() =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.consumers.${consumerId}.label`
                )}
        />
    </div>

    <div class="a5e-field-group u-flex-row u-gap-md">
        <div class="u-flex u-flex-col u-gap-sm">
            <h3 class="a5e-field-group__heading">
                {localize("A5E.Item")}
            </h3>

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
            {:else}
                <p class="a5e-field-group__hint" style="color: $color-warning;">
                    <i class="fa-solid fa-circle-exclamation" />

                    Item selection will be available when item is on an actor.
                </p>
            {/if}
        </div>

        {#if $item.actor}
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
                            Number(target.value)
                        )}
                />
            </div>
        {/if}
    </div>
</section>
