<script lang="ts">
  import { getContext } from "svelte";
  import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

  function getItemDetails() {
    const details: string[] = [];

    if (item.type === "object") {
      details.push(CONFIG.A5E.objectTypes[item.system.objectType]);
    }

    return details;
  }

  let item: ActionItem = getContext("item");
  const { A5E } = CONFIG;

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
    {#if item.isType("maneuver")}
      <div class="a5e-item-sheet__header__details-wrapper--input">
        <label for="" class="a5e-item-sheet__header__details-wrapper__label">
          Prerequisites:
        </label>

        <input
          class="a5e-item-sheet__header__details-wrapper__input"
          type="text"
          value={item.reactive.system.prerequisite ?? ""}
          placeholder={_loc("A5E.None")}
          onchange={({ currentTarget }) => {
            updateDocumentDataFromField(item, "system.prerequisite", currentTarget.value);
          }}
        />
      </div>
    {:else}
      {itemDetails.join(", ")}
    {/if}
  </div>

  <!-- Summary for different items -->
  <div class="a5e-item-sheet__header__summary-wrapper">
    <!-- Maneuver -->
    {#if item.isType("maneuver")}
      {let itemData = $derived(item.reactive.system)}
      <!-- Degree -->
      <div class="a5e-item-sheet__header__summary">
        <span class="a5e-summary-value">
          {A5E.maneuverDegrees[itemData.degree]}
        </span>
      </div>

      <!-- Tradition -->
      <div class="a5e-item-sheet__header__summary">
        <span class="a5e-summary-value">
          {A5E.maneuverTraditions[itemData.tradition] ?? itemData.tradition}
        </span>
      </div>

      <!-- Stance -->
      {#if itemData.stance}
        <div class="a5e-item-sheet__header__summary">
          <span class="a5e-summary-value">Stance</span>
        </div>
      {/if}

      <!-- Cost -->
      <div class="a5e-item-sheet__header__summary">
        <span class="a5e-summary-label">Cost: </span>
        <span class="a5e-summary-value">{itemData.exertionCost}</span>
      </div>
    {/if}

    <!-- Object -->
    {#if item.isType("object")}
      {let itemData = $derived(item.reactive.system)}
      {#if itemData?.price?.value}
        <!-- Currency -->
        <div class="a5e-item-sheet__header__summary">
          <i class="a5e-summary-icon fa-solid fa-coins"></i>
          <span class="a5e-summary-value">{itemData.price.value}</span>
          <span class="a5e-summary-label">
            {itemData.price.denomination?.toUpperCase()}
          </span>
        </div>
      {/if}

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
  </div>
</header>

<style lang="scss">
  .a5e-item-sheet__header {
    grid-area: header;
    display: flex;
    flex-direction: column;
    gap: var(--a5e-spacing-sm);
    margin-top: var(--a5e-spacing-sm);
    margin-bottom: var(--a5e-spacing-md);

    &__item-name {
      font-family: var(--a5e-secondary-font);
      font-size: var(--a5e-text-xl);
      border: var(--a5e-border-width-none);
      background: transparent;
      text-overflow: ellipses;
      padding: var(--a5e-spacing-none);
      margin: var(--a5e-spacing-none);
    }

    &__details-wrapper {
      font-style: italic;
      font-size: var(--a5e-text-sm);

      &--input {
        display: flex;
        gap: var(--a5e-spacing-sm);
        align-items: center;
      }

      &__input {
        background: transparent;
        text-overflow: ellipses;
        font-size: var(a5e-text-sm);
        padding: var(--a5e-spacing-none);
        border: var(--a5e-border-width-none);
        height: calc(var(--a5e-text-sm) + 0.125rem) !important;
      }
    }

    &__summary-wrapper {
      display: flex;
      // gap: var(--a5e-spacing-sm);
      font-size: var(--a5e-text-sm);

      > :not(:last-child)::after {
        content: "|";
        margin-inline: var(--a5e-spacing-sm) var(--a5e-spacing-md);
      }
    }

    &__summary {
      display: flex;
      align-items: center;
      gap: var(--a5e-spacing-sm);
    }
  }

  .a5e-summary-icon,
  .a5e-summary-label {
    color: var(--a5e-text-color-medium);
  }
</style>
