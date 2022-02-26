<template>
  <header class="u-align-center u-flex u-gap-lg">
    <h3 class="u-text-sm">{{ localize(heading) }}</h3>

    <a @click.prevent="toggleAll" class="u-text-xs"> + Toggle All</a>
  </header>

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
      :selected="selectedCoreOptions.includes(value)"
      @option-selected="onOptionSelected"
    />
  </ul>

  <div class="u-mt-sm u-w-full">
    <input class="a5e-input" type="text" v-model.lazy="selectedCustomOptions" />

    <span class="a5e-form__hint">{{
      localize("A5E.HintSeparateBySemiColon")
    }}</span>
  </div>
</template>

<script>
import { computed } from "vue";

import arraysAreEqual from "../../modules/utils/arraysAreEqual";

import OptionTag from "../forms/OptionTag.vue";

export default {
  components: { OptionTag },
  props: {
    heading: String,
    options: Array,
    selected: Array,
    selectionHandler: Function,
  },
  setup(props) {
    const optionKeys = props.options.map(([key]) => key);

    const selectedCoreOptions = computed({
      get: () => props.selected.filter((option) => optionKeys.includes(option)),
      set: (currentCoreSelection) => {
        props.selectionHandler([
          ...currentCoreSelection,
          ...selectedCustomOptions.value
            .split(";")
            .map((option) => option.trim())
            .filter(Boolean),
        ]);
      },
    });

    const selectedCustomOptions = computed({
      get: () =>
        props.selected
          .filter((option) => !optionKeys.includes(option))
          .join("; "),
      set: (currentCustomSelection) => {
        props.selectionHandler([
          ...selectedCoreOptions.value,
          ...currentCustomSelection
            .split(";")
            .map((option) => option.trim())
            .filter(Boolean),
        ]);
      },
    });

    function onOptionSelected(option) {
      const currentSelection = Array.from(selectedCoreOptions.value);
      const index = currentSelection.indexOf(option);

      if (index !== -1) currentSelection.splice(index, 1);
      else currentSelection.push(option);

      selectedCoreOptions.value = currentSelection;
    }

    function toggleAll() {
      if (arraysAreEqual(optionKeys, selectedCoreOptions.value)) {
        selectedCoreOptions.value = [];
      } else {
        selectedCoreOptions.value = optionKeys;
      }
    }

    return {
      localize: (key) => game.i18n.localize(key),
      onOptionSelected,
      selectedCustomOptions,
      selectedCoreOptions,
      toggleAll,
    };
  },
};
</script>
