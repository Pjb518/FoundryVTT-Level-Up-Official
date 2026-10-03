<script lang="ts">
  import { getContext } from "svelte";
  import { type ItemA5e } from "#documents/item/item.ts";
  import getBaseActionSummary from "#utils/summaries/getBaseActionSummaryData.ts";
  import { editDocumentImage } from "#utils/view/editDocumentImage.ts";
  import { getProperties } from "#utils/view/item/getProperties.ts";

  function getActionSummaries() {
    const actions = [...item.reactive.actions.values()];
    const summaryData = actions.map((action) => ({
      actionName: action.name,
      actionData: getBaseActionSummary(item.reactive, action),
    }));

    console.log(summaryData);

    return summaryData;
  }

  let item: ItemA5e = getContext("item");

  let itemData = $derived(item.reactive.system);
  let itemProperties = $derived(getProperties(item.reactive));
  let actionSummaries = $derived(getActionSummaries());
</script>

<aside class="a5e-item-sheet__aside">
  <img
    class="a5e-item-sheet__image"
    src={item.reactive.img}
    alt={item.reactive.name}
  />

  <div class="a5e-item-sheet__aside__toggles">
    <!--  -->
  </div>

  <div class="a5e-item-sheet__aside__properties__wrapper">
    <div class="a5e-item-sheet__aside__header">Properties</div>

    <div class="a5e-item-sheet__aside__properties">
      {#each itemProperties as property}
        <span class="a5e-item-sheet__property">{property.value}</span>
      {/each}
    </div>
  </div>

  <div class="a5e-item-sheet__aside__action-summary__wrapper">
    <div class="a5e-item-sheet__aside__header">Action Summary</div>

    <div class="a5e-item-sheet__aside__summaries">
      {#each actionSummaries as { actionName, actionData }}
        <div class="a5e-item-sheet__aside__summary">
          <span>{actionName}</span>
          <span>{actionData.activationCost}</span>
          <span>{actionData.ranges}</span>
          <span>{actionData.targets}</span>
          <span>{actionData.area}</span>
          <span>{actionData.duration}</span>
          <span>{actionData.attackRoll}</span>
          <span>{actionData.damage}</span>
          <span>{actionData.savingThrow}</span>
        </div>
      {/each}
    </div>
  </div>
</aside>

<style lang="scss">
  .a5e-item-sheet {
    &__aside {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding-inline: 0.5rem;

      &__properties {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
    }

    &__image {
      width: 100%;
      aspect-ratio: 1/1;
      border-radius: 0.25rem;
    }
  }
</style>
