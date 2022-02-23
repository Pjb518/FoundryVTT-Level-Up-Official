<template>
  <ul
    v-if="tags.length"
    class="u-flex u-flex-wrap u-gap-xs u-list-style-none u-m-0 u-p-0 u-text-xxs"
  >
    <span
      v-for="tag in tags"
      :key="tag"
      class="a5e-tag a5e-tag--light a5e-tag--tight"
    >
      {{ tag }}
    </span>
  </ul>
</template>

<script>
import { computed, inject } from "@vue/runtime-core";
import prepareRangeSummary from "../../../../utils/dataPreparationHelpers/prepareRangeSummary";

export default {
  props: { item: Object },
  setup(props) {
    const actor = inject("actor");

    const tags = computed(() => {
      const config = CONFIG.A5E;
      const item = actor.items.get(props.item._id);
      const itemData = item.data.data;
      const spellLevel = parseInt(itemData.level, 10);

      const tagList = Object.entries(config.spellComponents).reduce(
        (acc, [key, value]) => {
          if (itemData.components[key]) {
            acc.push(game.i18n.localize(`${value}Abbr`));
          }

          return acc;
        },
        []
      );

      if (itemData.concentration) {
        tagList.push(game.i18n.localize("A5E.SpellConcentrationAbbr"));
      }

      if (spellLevel && itemData.ritual) {
        tagList.push(game.i18n.localize("A5E.SpellRitualAbbr"));
      }

      if (itemData.range.filter(Boolean).length) {
        const rangeComponents = [game.i18n.localize("A5E.ItemRange"), "-"];
        rangeComponents.push(prepareRangeSummary(itemData.range));
        tagList.push(rangeComponents.join(" "));
      }

      return tagList;
    });

    return {
      tags,
    };
  },
};
</script>
