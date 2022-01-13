<template>
  <section
    class="a5e-form__section"
    :class="{
      'a5e-form__section--inline': inline,
    }"
  >
    <h3
      class="a5e-form__input-label"
      v-if="heading"
      :class="{ 'a5e-form__input-label--inline': inline }"
    >
      {{ heading }}
    </h3>

    <div
      class="a5e-input-container"
      :class="{ 'a5e-input-container--inline': inline }"
    >
      <select v-model="currentSelection" class="a5e-select">
        <option v-for="[key, value] of values" :key="key" :value="key">
          {{ value }}
        </option>
      </select>
    </div>
  </section>
</template>

<script>
import { ref, watch } from "vue";

export default {
  props: {
    heading: String,
    initialValue: String,
    inline: { type: Boolean, required: false },
    values: Object,
  },
  emits: ["update-selection"],
  setup(props, context) {
    const heading = game.i18n.localize(props.heading);
    const currentSelection = ref(props.initialValue);

    const values = Object.entries(props.values).map(([key, value]) => [
      key,
      game.i18n.localize(value),
    ]);

    watch(currentSelection, (curr) => {
      context.emit("update-selection", curr);
    });

    return {
      currentSelection,
      heading,
      values,
    };
  },
};
</script>
