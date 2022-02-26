<template>
  <section class="u-flex u-gap-md u-h-full u-pb-xxxl u-pl-lg u-pt-lg">
    <filter-box tab="spells">
      <filter-group
        filterKey="spellActivationCostFilters"
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
        filterKey="spellComponentFilters"
        :filterOptions="config.spellComponents"
        heading="A5E.FilterLabelSpellComponents"
      />

      <filter-group
        filterKey="spellSchoolFilters"
        :filterOptions="config.spellSchools.primary"
        heading="A5E.FilterLabelSpellSchools"
      />

      <filter-group
        filterKey="miscellaneousSpellFilters"
        :filterOptions="{
          concentration: 'A5E.SpellConcentration',
          prepared: 'A5E.ItemPrepared',
          ritual: 'A5E.SpellRitual',
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
      <section
        v-for="[level, label] in Object.entries(config.spellLevels).filter(
          ([level, _]) =>
            data.flags.a5e?.availableSpellLevels?.includes(level) ?? true
        )"
        :key="level"
      >
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
          <h3 class="u-border-none u-font-serif u-text-lg u-w-fit">
            {{ localize(label) }}
          </h3>

          <div
            v-if="level !== '0' && showSpellSlots"
            class="u-align-center u-flex u-gap-xs u-ml-lg u-mr-auto"
          >
            <input
              class="a5e-spell-slots__input"
              type="number"
              :name="`data.spellResources.slots.${level}.current`"
              :value="data.data.spellResources.slots[level].current"
              data-dtype="Number"
              min="0"
              max="9"
            />
            /
            <span v-if="sheetIsLocked" class="a5e-spell-slots__input">{{
              data.data.spellResources.slots[level].max
            }}</span>

            <input
              v-else
              class="a5e-spell-slots__input"
              type="number"
              :name="`data.spellResources.slots.${level}.max`"
              :value="data.data.spellResources.slots[level].max"
              data-dtype="Number"
              min="0"
              max="9"
            />
          </div>

          <a
            v-if="!sheetIsLocked"
            class="a5e-button a5e-button--add-item"
            @click="onCreateItem(level)"
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
          <item
            v-for="spell in spells.filter(
              (spell) => spell.data.level.toString() === level
            )"
            :key="spell._id"
            :item="spell"
          />
        </ul>
      </section>
    </section>

    <tab-footer>
      <div class="u-align-center u-flex u-gap-md u-text-md">
        <h3 class="u-mb-0">
          {{ localize("A5E.SpellDC") }}
        </h3>

        <span class="a5e-footer-group__value">{{ spellDC }}</span>
      </div>

      <div
        v-if="showSpellPoints"
        class="u-align-center u-flex u-gap-md u-text-md"
      >
        <h3 class="u-mb-0">
          {{ localize("A5E.SpellPoints") }}
        </h3>

        <input
          class="a5e-footer-group__input"
          type="number"
          name="data.spellResources.points.current"
          :value="data.data.spellResources.points.current"
          placeholder="0"
          min="0"
          data-dtype="Number"
        />
        /
        <input
          class="a5e-footer-group__input"
          type="number"
          name="data.spellResources.points.max"
          :value="data.data.spellResources.points.max"
          placeholder="0"
          min="0"
          data-dtype="Number"
        />
      </div>

      <div
        v-if="!sheetIsLocked"
        class="u-align-center u-flex u-gap-md u-h-6 u-text-md"
      >
        <h3 class="u-mb-0">{{ localize("A5E.ConfigureSpells") }}</h3>

        <i
          class="a5e-config-button u-text-md fas fa-cog"
          @click="onConfigureSpellTab"
        >
        </i>
      </div>
    </tab-footer>
  </section>
</template>

<script>
import { computed, inject, onMounted } from "vue";

import applySpellFilters from "../../utils/filterHelpers/applySpellFilters";

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

    const spells = computed(() =>
      applySpellFilters(
        actor,
        data.value.items.filter((item) => item.type === "spell")
      ).sort((a, b) => a.sort - b.sort)
    );

    const spellDC = computed(() => {
      const { abilities, attributes, bonuses } = data.value.data;
      const spellcastingAbility = attributes.spellcasting || "int";

      return (
        8 +
        attributes.prof +
        (parseInt(bonuses?.spell?.dc, 10) || 0) +
        abilities[spellcastingAbility].check.mod
      );
    });

    const showSpellPoints = computed(
      () => data.value.flags?.a5e?.showSpellPoints ?? true
    );

    const showSpellSlots = computed(
      () => data.value.flags?.a5e?.showSpellSlots ?? true
    );

    onMounted(() => {
      sheet.activateVueListeners($(sheet.form));
    });

    function onConfigureSpellTab() {
      actor.configureSpellTab();
    }

    async function onCreateItem(level = 0) {
      const newItems = await actor.createEmbeddedDocuments("Item", [
        {
          name: game.i18n.localize("A5E.ItemNew"),
          type: "spell",
          "data.level": Number(level),
        },
      ]);

      newItems[0].sheet.render(true);
    }

    return {
      config: CONFIG.A5E,
      data,
      spells,
      localize: (key) => game.i18n.localize(key),
      onConfigureSpellTab,
      onCreateItem,
      showSpellPoints,
      showSpellSlots,
      sheetIsLocked,
      spellDC,
    };
  },
};
</script>
