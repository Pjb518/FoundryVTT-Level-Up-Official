<template>
  <section class="u-flex u-gap-md u-h-full u-pb-xxxl u-pl-lg u-pt-lg">
    <filter-box tab="maneuvers">
      <filter-group
        filterKey="maneuverActivationCostFilters"
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

      <filter-group
        filterKey="maneuverDegreeFilters"
        :filterOptions="config.maneuverDegrees"
        heading="A5E.ManeuverDegree"
      />

      <filter-group
        filterKey="maneuverTraditionFilters"
        :filterOptions="config.maneuverTraditions"
        heading="A5E.ManeuverTradition"
      />
    </filter-box>

    <section
      class="
        u-flex
        u-flex-col
        u-flex-grow
        u-gap-xl
        u-h-full
        u-mb-xl
        u-overflow-y-auto
        u-pb-xl
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
            {{ localize("A5E.TabManeuvers") }}
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

    <tab-footer>
      <div class="u-align-center u-flex u-gap-md u-text-md">
        <h3 class="u-mb-0">
          {{ localize("A5E.ManeuverDC") }}
        </h3>

        <span class="a5e-footer-group__value">{{ maneuverDC }}</span>
      </div>

      <div class="u-align-center u-flex u-gap-md u-text-md">
        <h3 class="u-mb-0">
          {{ localize("A5E.ExertionPool") }}
        </h3>

        <input
          class="a5e-footer-group__input"
          type="number"
          name="data.attributes.exertion.current"
          :value="data.data.attributes.exertion.current"
          placeholder="0"
          min="0"
          data-dtype="Number"
        />
        /
        <input
          class="a5e-footer-group__input"
          type="number"
          name="data.attributes.exertion.max"
          :value="data.data.attributes.exertion.max"
          placeholder="0"
          min="0"
          data-dtype="Number"
        />
      </div>

      <div
        v-if="!sheetIsLocked"
        class="u-align-center u-flex u-gap-md u-text-md"
      >
        <h3 class="u-mb-0">{{ localize("A5E.ConfigureManeuvers") }}</h3>

        <i
          class="a5e-config-button u-text-md fas fa-cog"
          @click="onConfigureManeuvers"
        >
        </i>
      </div>
    </tab-footer>
  </section>
</template>

<script>
import { computed, inject, onMounted } from "vue";

import applyManeuverFilters from "../../utils/filterHelpers/applyManeuverFilters";

import FilterBox from "./partials/FilterBox.vue";
import FilterGroup from "./partials/FilterGroup.vue";
import Item from "./partials/Item.vue";
import TabFooter from "./partials/TabFooter.vue";

export default {
  components: { FilterBox, FilterGroup, Item, TabFooter },
  setup() {
    const actor = inject("actor");
    const data = inject("data");
    const sheet = inject("sheet");
    const sheetIsLocked = inject("sheetIsLocked");

    const items = computed(() =>
      applyManeuverFilters(
        actor,
        data.value.items.filter((x) => x.type === "maneuver")
      ).sort((a, b) => a.sort - b.sort)
    );

    const maneuverDC = computed(() => {
      const { abilities, attributes, bonuses } = data.value.data;

      return (
        8 +
        attributes.prof +
        (parseInt(bonuses.maneuverDC, 10) || 0) +
        Math.max(abilities.str.check.mod, abilities.dex.check.mod)
      );
    });

    onMounted(() => {
      sheet.activateVueListeners($(sheet.form));
    });

    function onConfigureManeuvers() {
      actor.configureManeuvers();
    }

    async function onCreateItem() {
      const newItems = await actor.createEmbeddedDocuments("Item", [
        {
          name: game.i18n.localize("A5E.ItemNew"),
          type: "maneuver",
        },
      ]);

      newItems[0].sheet.render(true);
    }

    return {
      config: CONFIG.A5E,
      data,
      items,
      localize: (key) => game.i18n.localize(key),
      maneuverDC,
      onConfigureManeuvers,
      onCreateItem,
      sheetIsLocked,
    };
  },
};
</script>
