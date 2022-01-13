<template>
  <section class="a5e-form__section">
    <h3 v-if="heading" class="a5e-form__input-label">{{ heading }}</h3>

    <div class="a5e-radio-group">
      <template
        v-for="value in values"
        :key="baseId + (value.id || value.name)"
      >
        <input
          class="a5e-u-hidden"
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
  </section>
</template>

<script>
import { ref, watch } from "vue";

export default {
  props: {
    baseId: String,
    heading: { type: String, required: false },
    initialSelection: [Boolean, String, Number],
    values: Array,
    wide: { type: Boolean, default: false },
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
