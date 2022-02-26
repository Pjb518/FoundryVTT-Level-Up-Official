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
      :selected="selected.includes(value)"
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
    selected: Array,
    selectionHandler: Function,
  },
  setup(props) {
    function onOptionSelected(option) {
      const selected = Array.from(props.selected);
      const index = selected.indexOf(option);

      if (index !== -1) selected.splice(index, 1);
      else selected.push(option);

      props.selectionHandler(selected);
    }

    return {
      onOptionSelected,
    };
  },
};
</script>
