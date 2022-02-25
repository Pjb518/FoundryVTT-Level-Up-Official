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
    :class="listClasses"
  >
    <option-tag
      v-for="[value, label] in options"
      :key="value"
      v-bind="{ classes: optionClasses, label, value }"
      :selected="selected === value || selected?.toString() === value"
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
    listClasses: { type: String, default: "" },
    optionClasses: { type: String, default: "" },
    options: Array,
    updatePath: String,
  },
  setup(props) {
    const data = inject("data");
    const selected = computed(() => getProperty(data.value, props.updatePath));

    function onOptionSelected(option) {
      props.document.update({ [props.updatePath]: option });
    }

    return {
      data,
      onOptionSelected,
      selected,
    };
  },
};
</script>
