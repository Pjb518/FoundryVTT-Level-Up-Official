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

export default {
  props: { item: Object },
  setup(props) {
    const actor = inject("actor");

    const tags = computed(() => {
      const config = CONFIG.A5E;
      const item = actor.items.get(props.item._id);
      const itemData = item.data.data;
      const rangeCategory = item.data.data.range.category;

      const tagList = [];

      if (itemData.requiresAttunement) {
        if (itemData.attuned) {
          tagList.push(game.i18n.localize("A5E.Attuned"));
        } else {
          tagList.push(game.i18n.localize("A5E.AttunementRequired"));
        }
      }

      if (itemData.bulky) {
        tagList.push(game.i18n.localize("A5E.ItemBulky"));
      }

      if (itemData.plotItem) {
        tagList.push(game.i18n.localize("A5E.PlotItem"));
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
            config.rangeDescriptors[rangeCategory]
          );

          rangeComponents.push(rangeDescriptor);

          if (
            config.rangeValues[rangeCategory] &&
            config.rangeValues[rangeCategory] !==
              config.rangeDescriptors[rangeCategory]
          ) {
            rangeComponents.push(`(${config.rangeValues[rangeCategory]} ft.)`);
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
