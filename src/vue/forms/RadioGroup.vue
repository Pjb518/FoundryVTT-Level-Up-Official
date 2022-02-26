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
import OptionTag from "./OptionTag.vue";

export default {
  components: { OptionTag },
  props: {
    listClasses: { type: String, default: "" },
    optionClasses: { type: String, default: "" },
    options: Array,
    selected: String | Number,
    selectionHandler: Function,
  },
  setup(props) {
    function onOptionSelected(option) {
      props.selectionHandler(option);
    }

    return {
      onOptionSelected,
    };
  },
};
</script>
