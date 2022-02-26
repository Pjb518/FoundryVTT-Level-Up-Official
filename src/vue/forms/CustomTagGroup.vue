<template>
  <header class="u-align-center u-flex u-gap-lg">
    <h3 class="u-text-bold u-text-sm">{{ localize(heading) }}</h3>

    <a @click.prevent="toggleAll" class="u-text-xs"> + Toggle All</a>
  </header>

  <checkbox-group
    :options="options"
    :selected="selectedCoreOptions"
    :selectionHandler="onOptionSelected"
  />

  <div v-if="showCustomInput" class="u-mt-sm u-w-full">
    <input class="a5e-input" type="text" v-model.lazy="selectedCustomOptions" />

    <span class="a5e-form__hint">{{
      localize("A5E.HintSeparateBySemiColon")
    }}</span>
  </div>
</template>

<script>
import { computed } from "vue";

import arraysAreEqual from "../../modules/utils/arraysAreEqual";

import CheckboxGroup from "../forms/CheckboxGroup.vue";

export default {
  components: { CheckboxGroup },
  props: {
    heading: String,
    options: Array,
    selected: Array,
    selectionHandler: Function,
    showCustomInput: { type: Boolean, default: true },
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

    function onOptionSelected(currentCoreSelection) {
      selectedCoreOptions.value = currentCoreSelection;
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
