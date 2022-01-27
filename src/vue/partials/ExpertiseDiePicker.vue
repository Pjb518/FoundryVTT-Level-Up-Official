<template>
  <section class="a5e-form__section">
    <h3 class="u-text-bold u-text-sm">{{ heading }}</h3>

    <div class="u-flex u-gap-md u-text-sm a5e-radio-group--expertise">
      <template
        v-for="value in expertiseDice"
        :key="appId + baseId + (value.id || value.name)"
      >
        <input
          class="u-hidden"
          type="radio"
          :name="appId + baseId + value.name"
          :value="value.value"
          :id="appId + baseId + (value.id || value.name)"
          v-model="selectedValue"
        />

        <label
          class="a5e-radio-group__button"
          :for="appId + baseId + (value.id || value.name)"
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
    appId: String,
    baseId: { type: String, default: "-expertise-" },
    heading: { type: String, default: "A5E.ExpertiseDie" },
    initialSelection: [Boolean, String, Number],
  },
  setup(props, context) {
    const heading = game.i18n.localize(props.heading);
    const selectedValue = ref(props.initialSelection);

    const expertiseDice = [
      { name: game.i18n.localize("A5E.None"), value: 0 },
      { name: "d4", value: 1 },
      { name: "d6", value: 2 },
      { name: "d8", value: 3 },
      { name: "d10", value: 4 },
      { name: "d12", value: 5 },
    ];

    watch(
      selectedValue,
      (curr) => {
        context.emit("updateSelection", curr);
      },
      { immediate: true }
    );

    return {
      heading,
      expertiseDice,
      selectedValue,
    };
  },
};
</script>
