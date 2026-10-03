<script lang="ts">
  import { getContext } from "svelte";
  import { type ItemA5e } from "#documents/item/item.ts";
  import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

  function getItemDetails() {
    const details: string[] = [];

    if (item.type === "object") {
      details.push(CONFIG.A5E.objectTypes[item.system.objectType]);
    }

    return details;
  }

  let item: ItemA5e = getContext("item");

  let itemData = $derived(item.reactive.system);
  let itemDetails = $derived(getItemDetails());
</script>

<header class="a5e-item-sheet__header">
  <div class="a5e-item-sheet__header__name-wrapper">
    <input
      class="a5e-item-sheet__header__item-name"
      type="text"
      value={item.reactive.name}
      placeholder={_loc("A5E.Name")}
      onchange={({ currentTarget }) =>
        updateDocumentDataFromField(item, "name", currentTarget.value)}
    />
  </div>

  <div class="a5e-item-sheet__header__details-wrapper">
    {itemDetails.join(", ")}
  </div>

  <!-- Summary for different items -->
  <div class="a5e-item-sheet__header__summary-wrapper">
    {#if item.isType("object")}
      {#if itemData?.price?.value}
        <!-- Currency -->
        <div class="a5e-item-sheet__header__summary">
          <i class="a5e-summary-icon fa-solid fa-coins"></i>
          <span class="a5e-summary-value">{itemData.price.value}</span>
          <span class="a5e-summary-label">
            {itemData.price.denomination?.toUpperCase()}
          </span>
        </div>

        <!-- Weight -->
        <div class="a5e-item-sheet__header__summary">
          <i class="a5e-summary-icon fa-solid fa-weight-hanging"></i>
          <span class="a5e-summary-value">{itemData.weight}</span>
          <span class="a5e-summary-label">lb</span>
        </div>

        <!-- Quantity -->
        <div class="a5e-item-sheet__header__summary">
          <span class="a5e-summary-label">Quantity: </span>
          <span class="a5e-summary-value">{itemData.quantity}</span>
        </div>
      {/if}
    {/if}
  </div>
</header>

<style lang="scss">
  .a5e-item-sheet__header {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 0.75rem;

    &__item-name {
      font-family: var(--a5e-secondary-font);
      font-size: var(--a5e-xl-text);
      border: 0;
      background: transparent;
      text-overflow: ellipses;
      padding: 0;
      margin: 0;
    }

    &__details-wrapper {
      font-style: italic;
      font-size: var(--a5e-sm-text);
    }

    &__summary-wrapper {
      display: flex;
      // gap: 0.5rem;
      font-size: var(--a5e-sm-text);

      > :not(:last-child)::after {
        content: "|";
        margin-inline: 0.75rem;
      }
    }

    &__summary {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
  }

  .a5e-summary-icon,
  .a5e-summary-label {
    color: var(--a5e-text-color-medium);
  }
</style>
