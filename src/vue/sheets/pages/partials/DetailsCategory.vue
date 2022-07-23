<template>
  <section
    class="u-bg-gray u-flex u-flex-col u-gap-xs u-p-md u-pos-relative u-rounded"
  >
    <h2 class="u-text-bold u-text-sm">
      {{ localize(heading) }}
    </h2>

    <i
      v-if="!sheetIsLocked"
      class="a5e-config-button a5e-config-button--details fas fa-cog"
      @click="$emit('open-config-window', category)"
    ></i>

    <ul
      class="
        u-flex
        u-flex-wrap
        u-font-san-serif
        u-gap-xs
        u-list-style-none
        u-m-0
        u-p-0
        u-text-xxs
      "
    >
      <template v-if="tags.length">
        <li v-for="tag in tags" :key="tag" class="a5e-tag a5e-tag--tight">
          {{ tag }}
        </li>
      </template>

      <li v-else class="u-border u-border-transparent u-py-xxxs u-text-medium">
        {{ localize("A5E.None") }}
      </li>
    </ul>
  </section>
</template>

<script>
import { inject } from "vue";

export default {
  emits: ["open-config-window"],
  props: {
    category: String,
    heading: String,
    sheetIsLocked: Boolean,
    tags: Array,
  },
  setup() {
    const sheetIsLocked = inject("sheetIsLocked");

    return {
      config: CONFIG.A5E,
      localize: (key) => game.i18n.localize(key),
      sheetIsLocked,
    };
  },
};
</script>
