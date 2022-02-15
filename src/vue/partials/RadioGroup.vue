<template>
  <div
    class="a5e-radio-group u-flex u-gap-md u-text-sm"
    :class="{ 'u-flex-wrap': wrap }"
  >
    <template v-for="value in values" :key="baseId + (value.id || value.name)">
      <input
        class="u-hidden"
        type="radio"
        :name="baseId + value.name"
        :value="value.value"
        :id="baseId + (value.id || value.name)"
        v-model="selectedValue"
      />

      <label
        class="a5e-radio-group__button"
        :class="{ 'a5e-radio-group__button--full-width': wide }"
        :for="baseId + (value.id || value.name)"
      >
        {{ value.name }}
      </label>
    </template>
  </div>
</template>

<script>
import { ref, watch } from "vue";

export default {
  props: {
    baseId: String,
    initialSelection: [Boolean, String, Number],
    values: Array,
    wide: { type: Boolean, default: false },
    wrap: { type: Boolean, default: true },
  },
  setup(props, context) {
    const heading = game.i18n.localize(props.heading);
    const selectedValue = ref(props.initialSelection);

    watch(
      selectedValue,
      (curr) => {
        context.emit("updateSelection", curr);
      },
      { immediate: true }
    );

    return {
      heading,
      selectedValue,
    };
  },
};
</script>
