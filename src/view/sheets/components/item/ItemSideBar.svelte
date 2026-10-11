<script lang="ts">
  import { getContext } from "svelte";
  import { type ItemA5e } from "#documents/item/item.ts";
  import getBaseActionSummary from "#utils/summaries/getBaseActionSummaryData.ts";
  import { editDocumentImage } from "#utils/view/editDocumentImage.ts";
  import { getProperties } from "#utils/view/item/getProperties.ts";

  import ItemSummary from "#view/sheets/components/item/ItemSummary.svelte";
  import Pill from "#view/snippets/Pill.svelte";

  function getActionSummaries() {
    const actions = [...item.reactive.actions.values()];
    const summaryData = actions.map((action) => ({
      actionName: action.name,
      actionData: getBaseActionSummary(item.reactive, action),
    }));

    return summaryData;
  }

  let item: ItemA5e = getContext("item");

  let itemData = $derived(item.reactive.system);
  let itemProperties = $derived(getProperties(item.reactive));
  let actionSummaries = $derived(getActionSummaries());
</script>

<aside class="a5e-item-sheet__aside">
  <img class="a5e-item-sheet__image" src={item.reactive.img} alt={item.reactive.name} />

  <div class="a5e-item-sheet__aside__toggles"></div>

  <div class="a5e-item-sheet__aside__properties__wrapper">
    <div class="a5e-item-sheet__aside__header">Properties</div>

    <ul class="a5e-item-sheet__aside__properties">
      {#each itemProperties as property}
        <Pill label={property.value} />
      {/each}
    </ul>
  </div>

  <div class="a5e-item-sheet__aside__summaries__wrapper">
    <div class="a5e-item-sheet__aside__header">Action Summary</div>

    <div class="a5e-item-sheet__aside__summaries">
      {#each actionSummaries as { actionName, actionData }}
        <Pill --a5e-pill-width="100%">
          <div class="a5e-item-sheet__aside__summary">
            <div class="a5e-item-sheet__aside__summary__header">
              <span>{actionName}</span>
            </div>

            <div class="a5e-item-sheet__aside__summary__details">
              <ItemSummary summaryData={actionData} />
            </div>
          </div>
        </Pill>
      {/each}
    </div>
  </div>
</aside>

<style lang="scss">
  .a5e-item-sheet {
    &__aside {
      display: flex;
      flex-direction: column;
      gap: var(--a5e-spacing-md);
      padding-inline: var(--a5e-spacing-sm);

      &__header {
        display: flex;
        align-items: center;
        gap: var(--a5e-spacing-md);
        text-align: center;
        font-size: var(--a5e-text-md);

        &::before,
        &::after {
          content: "";
          flex: 1;
          height: 3px;
          background: linear-gradient(to right, transparent, var(--a5e-color-primary));
        }

        &::after {
          background: linear-gradient(to left, transparent, var(--a5e-color-primary));
        }
      }

      &__properties {
        display: flex;
        gap: var(--a5e-spacing-sm);
        flex-wrap: wrap;
        font-size: var(--a5e-text-sm);

        padding: var(--a5e-spacing-none);
        margin: var(--a5e-spacing-none);
        list-style: none;

        &__wrapper {
          display: flex;
          flex-direction: column;
          gap: var(--a5e-spacing-sm);
        }
      }

      &__summaries {
        display: flex;
        flex-direction: column;
        gap: var(--a5e-spacing-sm);
        font-size: var(--a5e-text-sm);

        &__wrapper {
          display: flex;
          flex-direction: column;
          gap: var(--a5e-spacing-sm);
        }
      }

      &__summary {
        display: flex;
        flex-direction: column;
        gap: var(--a5e-spacing-sm);

        &__header {
          text-align: center;
        }

        &__details {
          display: flex;
          gap: var(--a5e-spacing-sm);
          flex-wrap: wrap;

          > :not(:last-child)::after {
            content: "|";
            margin-inline: 0.25rem;
          }
        }
      }
    }

    &__image {
      width: 100%;
      aspect-ratio: 1/1;
      border-radius: 0.25rem;
    }
  }
</style>
