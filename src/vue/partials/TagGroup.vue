<template>
  <section class="a5e-form__section">
    <div class="u-align-center u-flex u-gap-md u-mb-md u-text-xs">
      <h3 class="u-text-bold u-text-sm u-mb-0">
        {{ heading }}
      </h3>

      <a @click="toggleAll"> + Toggle All </a>
    </div>

    <ul
      class="
        u-flex
        u-flex-wrap
        u-font-san-serif
        u-gap-md
        u-list-style-none
        u-m-0
        u-p-0
        u-text-xs
      "
    >
      <li
        v-for="[key, value] in tags"
        class="a5e-tag u-pointer"
        :class="{ 'a5e-tag--inactive': !selected.includes(key) }"
        @click="toggleTag(key)"
        :key="key"
      >
        {{ value }}
      </li>
    </ul>
  </section>
</template>

<script>
import arraysAreEqual from "../../modules/utils/arraysAreEqual";

import { ref, watch } from "vue";

export default {
  props: {
    heading: String,
    initialSelections: Array,
    sort: { type: Boolean, default: true },
    tags: Object,
  },
  setup(props, context) {
    const heading = game.i18n.localize(props.heading);
    const selected = ref(props.initialSelections);

    let tags = Object.entries(props.tags).map(([key, value]) => [
      key,
      game.i18n.localize(value),
    ]);

    tags = props.sort ? tags.sort((a, b) => a[1] - b[1]) : tags;

    function toggleTag(tag) {
      const tagIndex = selected.value.indexOf(tag);

      if (tagIndex === -1) selected.value.push(tag);
      else selected.value.splice(tagIndex, 1);
    }

    function toggleAll() {
      const optionKeys = tags.map(([key, _]) => key);
      const selectedKeys = selected.value;

      if (arraysAreEqual(optionKeys, selectedKeys)) selected.value = [];
      else selected.value = optionKeys;
    }

    watch(
      selected,
      (curr) => {
        context.emit("updateSelectionList", curr);
      },
      { immediate: true }
    );

    return { heading, selected, tags, toggleAll, toggleTag };
  },
};
</script>
