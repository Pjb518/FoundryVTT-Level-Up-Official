<template>
  <ul
    class="
      u-flex
      u-flex-wrap
      u-gap-sm
      u-list-style-none
      u-m-0
      u-p-0
      u-text-xs
      u-w-full
    "
  >
    <option-tag
      v-for="[value, label] in options"
      :key="value"
      v-bind="{ label, value }"
      :selected="selected.includes(value)"
      @option-selected="onOptionSelected"
    />
  </ul>
</template>

<script>
import { computed, inject } from "vue";

import OptionTag from "./OptionTag.vue";

export default {
  components: { OptionTag },
  props: {
    document: Object,
    options: Array,
    updatePath: [String, Array],
  },
  setup(props) {
    const data = inject("data");

    const selected = computed(() => {
      return getProperty(data.value, props.updatePath);
    });

    function onOptionSelected(option) {
      const currentSelection = Array.from(selected.value);
      const index = currentSelection.indexOf(option);

      if (index !== -1) currentSelection.splice(index, 1);
      else currentSelection.push(option);

      props.document.update({ [props.updatePath]: currentSelection });
    }

    return {
      data,
      onOptionSelected,
      selected,
    };
  },
};
</script>
