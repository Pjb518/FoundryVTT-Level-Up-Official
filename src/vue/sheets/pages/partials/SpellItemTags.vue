<template>
  <ul
    v-if="tags.length"
    class="u-flex u-gap-xs u-list-style-none u-m-0 u-p-0 u-text-xxs"
  >
    <span v-for="tag in tags" :key="tag" class="a5e-tag a5e-tag--tight">
      {{ localize(tag) }}
    </span>
  </ul>
</template>

<script>
import { computed, inject } from "@vue/runtime-core";

export default {
  props: { item: Object },
  setup(props) {
    const actor = inject("actor");

    const tags = computed(() => {
      const item = actor.items.get(props.item._id);
      const spellLevel = parseInt(item.data.data.level, 10);
      const rangeCategory = item.data.data.range.category;

      const tagList = Object.entries(CONFIG.A5E.spellComponents).reduce(
        (acc, [key, value]) => {
          if (item.data.data.components[key]) {
            acc.push(game.i18n.localize(`${value}Abbr`));
          }

          return acc;
        },
        []
      );

      if (item.data.data.concentration) {
        tagList.push(game.i18n.localize("A5E.SpellConcentrationAbbr"));
      }

      if (spellLevel && item.data.data.ritual) {
        tagList.push(game.i18n.localize("A5E.SpellRitualAbbr"));
      }

      if (rangeCategory && rangeCategory !== "null") {
        if (rangeCategory === "other") {
          tagList.push(
            `${game.i18n.localize("A5E.ItemRange")} - ${
              item.data.data.range.custom
            }`
          );
        } else {
          const rangeComponents = [game.i18n.localize("A5E.ItemRange"), "-"];

          const rangeDescriptor = game.i18n.localize(
            CONFIG.A5E.rangeDescriptors[rangeCategory]
          );

          rangeComponents.push(rangeDescriptor);

          if (
            CONFIG.A5E.rangeValues[rangeCategory] &&
            CONFIG.A5E.rangeValues[rangeCategory] !==
              CONFIG.A5E.rangeDescriptors[rangeCategory]
          ) {
            rangeComponents.push(
              `(${CONFIG.A5E.rangeValues[rangeCategory]} ft.)`
            );
          }

          tagList.push(rangeComponents.join(" "));
        }
      }

      return tagList;
    });

    return {
      localize: (key) => game.i18n.localize(key),
      tags,
    };
  },
};
</script>
