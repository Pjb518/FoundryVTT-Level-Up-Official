<template>
  <section class="u-flex u-gap-md u-h-full u-pl-lg u-pt-lg">
    <filter-box tab="features">
      <filter-group
        filterKey="featureActivationCostFilters"
        :filterOptions="
          Object.fromEntries(
            Object.entries(config.abilityActivationTypes).filter(
              (_, value) =>
                value !== 'lairAction' && value !== 'legendaryAction'
            )
          )
        "
        heading="A5E.FilterLabelActivationCost"
      />
    </filter-box>

    <section
      class="
        u-flex
        u-flex-col
        u-flex-grow
        u-gap-xl
        u-h-full
        u-mb-lg
        u-overflow-y-auto
        u-pb-lg
      "
    >
      <section>
        <header
          class="
            u-border-b
            u-border-gray
            u-flex
            u-justify-space-between
            u-mr-xl
            u-mb-md
            u-pb-md
            u-px-md
          "
        >
          <h3 class="u-border-none u-font-serif u-text-lg u-w-full u-w-fit">
            {{ localize("A5E.TabFeatures") }}
          </h3>

          <a
            v-if="!sheetIsLocked"
            class="a5e-button a5e-button--add-item"
            @click="onCreateItem"
          >
            + {{ localize("A5E.ItemAdd") }}
          </a>
        </header>

        <ul
          class="
            u-flex
            u-flex-col
            u-gap-xs
            u-list-style-none
            u-m-0
            u-p-0
            u-pr-lg
            u-w-full
            a5e-js-item-list
          "
        >
          <item v-for="item in items" :key="item._id" :item="item" />
        </ul>
      </section>
    </section>
  </section>
</template>

<script>
import { computed, inject, onMounted } from "vue";

import applyFeatureFilters from "../../filterHelpers/applyFeatureFilters";

import FilterBox from "./partials/FilterBox.vue";
import FilterGroup from "./partials/FilterGroup.vue";
import Item from "./partials/Item.vue";

export default {
  components: { FilterBox, FilterGroup, Item },
  setup() {
    const actor = inject("actor");
    const data = inject("data");
    const sheet = inject("sheet");
    const sheetIsLocked = inject("sheetIsLocked");

    const items = computed(() =>
      applyFeatureFilters(
        actor,
        data.value.items.filter((x) => x.type === "feature")
      ).sort((a, b) => a.sort - b.sort)
    );

    onMounted(() => {
      sheet.activateVueListeners($(sheet.form));
    });

    async function onCreateItem() {
      const newItems = await actor.createEmbeddedDocuments("Item", [
        {
          name: game.i18n.localize("A5E.ItemNew"),
          type: "feature",
        },
      ]);

      newItems[0].sheet.render(true);
    }

    return {
      config: CONFIG.A5E,
      data,
      items,
      localize: (key) => game.i18n.localize(key),
      onCreateItem,
      sheetIsLocked,
    };
  },
};
</script>
