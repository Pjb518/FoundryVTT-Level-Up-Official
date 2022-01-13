<template>
  <section class="a5e-form__section a5e-form__section--inline">
    <h3 class="a5e-form__input-label a5e-form__input-label--inline">
      {{ heading }}
    </h3>

    <div class="a5e-input-container a5e-input-container--numeric">
      <input
        class="a5e-input"
        type="number"
        ref="inputField"
        v-model="fieldValue"
        :min="min ?? ''"
        :max="max ?? ''"
      />
    </div>
  </section>
</template>

<script>
import { ref, watch } from "vue";

export default {
  props: {
    hasInitialFocus: { type: Boolean, required: false },
    heading: String,
    initialValue: { type: [String, Number], required: false },
    min: { type: Number, required: false },
    max: { type: Number, required: false },
  },
  setup(props, context) {
    const heading = game.i18n.localize(props.heading);

    const fieldValue = ref(parseInt(props.initialValue));
    const inputField = ref(null);

    if (props.hasInitialFocus) {
      onMounted(async () => {
        // This setTimeout is required to prevent keypresses from macros being logged in the input
        // field during the initial component render.
        setTimeout(() => {
          inputField.value.focus();
        }, 0);
      });
    }

    watch(fieldValue, (curr) => {
      context.emit("update-field-value", curr);
    });

    return {
      fieldValue,
      heading,
      inputField,
    };
  },
};
</script>
