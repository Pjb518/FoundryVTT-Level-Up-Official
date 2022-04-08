<template>
  <form-section :heading="heading">
    <div class="u-flex u-flex-wrap u-gap-md u-pos-relative u-w-full">
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
          :selected="selected === value || selected?.toString() === value"
          @option-selected="onOptionSelected"
        />
      </ul>

      <div
        v-if="selected === 'other'"
        class="u-align-center u-flex u-gap-md u-w-full"
      >
        <input
          type="text"
          :id="`${appId}-range-${index}`"
          v-model="customRange"
        />
      </div>

      <i
        class="
          u-hover-scale-120
          u-hover-text-red
          u-pointer
          u-pos-absolute
          u-right-1
          u-text-medium
          u-transition
          fas
          fa-trash
        "
        @click.prevent="onDeleteRangeIncrement(index)"
      ></i>
    </div>
  </form-section>
</template>

<script>
import { computed, inject, ref, watch } from "vue";

import getOrdinalNumber from "../../../../../modules/utils/getOrdinalNumber";
import isStandardRange from "../../../../../modules/utils/isStandardRange";

import FormSection from "../../../../forms/FormSection.vue";
import OptionTag from "../../../../forms/OptionTag.vue";

export default {
  components: { FormSection, OptionTag },
  props: { range: String, index: Number },
  setup(props) {
    const appId = inject("appId");
    const data = inject("data");
    const item = inject("item");
    const index = props.index;

    const heading = game.i18n.format("A5E.ItemRangeIncrement", {
      increment: getOrdinalNumber(props.index + 1),
    });

    const customRange = ref(
      isStandardRange(getProperty(data.value, `data.range.${index}`))
        ? ""
        : getProperty(data.value, `data.range.${index}`)
    );

    const options = Object.entries(CONFIG.A5E.rangeDescriptors).map(
      ([value, label]) => {
        if (["short", "medium", "long"].includes(value)) {
          const range = CONFIG.A5E.rangeValues[value];
          return [value, `${game.i18n.localize(label)} (${range} ft.)`];
        }

        return [value, label];
      }
    );

    const selected = computed(() => {
      const range = getProperty(data.value, `data.range.${index}`);
      return isStandardRange(range) ? range : "other";
    });

    function onDeleteRangeIncrement(index) {
      const range = Object.values(data.value.data.range);
      range.splice(index, 1);

      item.update({ "data.range": range });
    }

    function onOptionSelected(option) {
      const range = Object.values(data.value.data.range);
      range.splice(
        index,
        1,
        isStandardRange(option) ? option : customRange.value
      );

      item.update({ "data.range": range });
    }

    watch(customRange, (newRange) => {
      const range = Object.values(data.value.data.range);
      range.splice(index, 1, newRange);

      item.update({ "data.range": range });
    });

    return {
      appId,
      config: CONFIG.A5E,
      customRange,
      data,
      heading,
      item,
      localize: (key) => game.i18n.localize(key),
      onDeleteRangeIncrement,
      onOptionSelected,
      options,
      selected,
    };
  },
};
</script>
