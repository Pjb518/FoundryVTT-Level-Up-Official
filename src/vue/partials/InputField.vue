<template>
  <section
    class="a5e-form__section"
    :class="{
      'a5e-form__section--reduced-margin': reduceMargin,
      'a5e-form__section--inline': inline,
    }"
  >
    <h3
      class="u-text-bold u-text-sm"
      :class="{ 'u-flex-shrink-0 u-mb-0': inline }"
      v-if="heading"
    >
      {{ heading }}
    </h3>

    <div
      class="a5e-input-container"
      :class="{ 'a5e-input-container--inline': inline }"
    >
      <input
        class="a5e-input"
        type="text"
        ref="inputField"
        v-model="fieldValue"
      />
    </div>

    <span class="a5e-form__hint" v-if="hint">{{ hint }}</span>
  </section>
</template>

<script>
import { onMounted, ref, watch } from "vue";

export default {
  props: {
    heading: { type: String, required: false },
    hasInitialFocus: { type: Boolean, required: false },
    hint: { type: String, required: false },
    initialValue: { type: [String, Number], required: false },
    inline: { type: Boolean, required: false },
    reduceMargin: { type: Boolean, required: false },
  },
  emits: ["update-field-value"],
  setup(props, context) {
    const heading = game.i18n.localize(props.heading);
    const hint = game.i18n.localize(props.hint);
    const fieldValue = ref(props.initialValue || "");
    const inline = ref(props.inline);
    const inputField = ref(null);

    if (props.hasInitialFocus) {
      onMounted(async () => {
        // This setTimeout is required to prevent key presses from macros being logged in the input
        // field during the initial component render.
        setTimeout(() => {
          inputField.value.focus();
        }, 0);
      });
    }

    /**
     * Watch for changes in the fieldValue so that inline option can be suppressed once the input
     * content grows too large to easily view.
     *
     * Once the input exceeds the box size, the field will be rendered on its own line.
     */
    watch(
      fieldValue,
      () => {
        // This setTimeout is required so that the input field is available during the immediate
        // call to watch.
        setTimeout(() => {
          if (props.inline && inline.value) {
            if (inputField.value.scrollWidth > inputField.value.clientWidth) {
              inline.value = false;
            } else {
              inline.value = props.inline;
            }
          }
        }, 0);
      },
      { immediate: true }
    );

    watch(fieldValue, (curr) => {
      context.emit("update-field-value", curr);
    });

    return {
      heading,
      hint,
      inline,
      inputField,
      fieldValue,
    };
  },
};
</script>
