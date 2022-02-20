<template>
  <section class="u-flex u-gap-md u-h-full u-pb-xxxl u-pl-lg u-pt-lg">
    <filter-box tab="inventory">
      <filter-group
        filterKey="itemActivationCostFilters"
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
        filterKey="objectTypeFilters"
        :filterOptions="config.objectTypes"
        heading="A5E.FilterLabelObjectTypes"
      />

      <filter-group
        filterKey="itemRarityFilters"
        :filterOptions="config.itemRarity"
        heading="A5E.FilterLabelRarity"
      />

      <filter-group
        filterKey="miscellaneousItemFilters"
        :filterOptions="{
          attuned: 'A5E.Attuned',
          bulky: 'A5E.ItemBulky',
          equipped: 'A5E.ItemEquipped',
          plotItem: 'A5E.PlotItem',
          requiresAttunement: 'A5E.AttunementRequired',
        }"
        heading="A5E.FilterLabelMiscellaneous"
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
            {{ localize("A5E.TabInventory") }}
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
      <div
        v-if="actorType === 'character'"
        class="u-align-center u-flex u-gap-md u-text-md"
      >
        <h3 class="u-flex u-gap-xs u-mb-0 u-text-lg">
          {{ localize("A5E.Attunement") }}
        </h3>

        <span
          class="a5e-footer-group__value a5e-footer-group__value--attunement"
        >
          {{ data.data.attributes.attunement.current }}
        </span>
        /
        <input
          class="a5e-footer-group__input a5e-footer-group__input--attunement"
          type="number"
          name="data.attributes.attunement.max"
          :value="data.data.attributes.attunement.max"
          placeholder="0"
          min="0"
          max="9"
          data-dtype="Number"
          v-autowidth
        />
      </div>

      <div
        v-if="actorType === 'character'"
        class="u-align-center u-flex u-gap-md u-text-md"
      >
        <div class="u-align-center u-flex u-gap-md u-text-md">
          <h3 class="u-flex u-gap-xs u-mb-0 u-text-lg">
            {{ localize("A5E.Supply") }}
          </h3>

          <input
            class="a5e-footer-group__input"
            type="number"
            name="data.supply"
            :value="data.data.supply"
            placeholder="0"
            min="0"
            data-dtype="Number"
            v-autowidth
          />
        </div>
      </div>

      <div
        class="u-align-center u-flex u-gap-md u-text-md"
        :class="{ 'u-ml-auto': actorType === 'npc' }"
      >
        <h3 class="u-flex u-gap-xs u-mb-0 u-text-lg">
          {{ localize("A5E.Currency") }}
          <i class="fas fa-coins"></i>
        </h3>

        <ol class="u-flex u-gap-xl u-list-style-none u-m-0 u-ml-xl u-p-0">
          <li
            class="u-align-center u-flex u-gap-md u-text-serif"
            v-for="[label, value] in Object.entries(data.data.currency)"
            :key="label"
          >
            <label class="u-flex u-gap-xs u-mb-0 u-text-lg u-text-uppercase">
              {{ label }}
            </label>

            <input
              class="a5e-footer-group__input a5e-footer-group__input--currency"
              type="number"
              :name="`data.currency.${label}`"
              :value="value"
              data-dtype="Number"
              v-autowidth="{ minWidth: '2.5rem' }"
            />
          </li>
        </ol>
      </div>
    </tab-footer>
  </section>
</template>

<script>
import { computed, inject, onMounted } from "vue";
import { directive as VueInputAutowidth } from "vue-input-autowidth";

import applyObjectFilters from "../../utils/filterHelpers/applyObjectFilters";

import FilterBox from "./partials/FilterBox.vue";
import FilterGroup from "./partials/FilterGroup.vue";
import Item from "./partials/Item.vue";
import TabFooter from "./partials/TabFooter.vue";

export default {
  components: { FilterBox, FilterGroup, Item, TabFooter },
  directives: { autowidth: VueInputAutowidth },
  setup() {
    const actor = inject("actor");
    const data = inject("data");
    const sheet = inject("sheet");
    const sheetIsLocked = inject("sheetIsLocked");

    const items = computed(() =>
      applyObjectFilters(
        actor,
        data.value.items.filter((x) => x.type === "object")
      ).sort((a, b) => a.sort - b.sort)
    );

    onMounted(() => {
      sheet.activateVueListeners($(sheet.form));
    });

    async function onCreateItem() {
      const newItems = await actor.createEmbeddedDocuments("Item", [
        {
          name: game.i18n.localize("A5E.ItemNew"),
          type: "object",
        },
      ]);

      newItems[0].sheet.render(true);
    }

    return {
      actorType: actor.type,
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
