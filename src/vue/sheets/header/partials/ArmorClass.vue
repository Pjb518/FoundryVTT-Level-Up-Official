<template>
  <li
    class="
      u-align-center
      u-bg-gray
      u-flex
      u-flex-col
      u-justify-space-between
      u-py-xs
      u-rounded
      u-w-full
    "
  >
    <h4 class="u-text-lg">{{ localize("A5E.ArmorClassAbbr") }}</h4>

    <div
      v-if="sheetIsLocked"
      class="a5e-ability-score__value a5e-ability-score__value--ac"
    >
      {{ data.data.attributes.ac }}
    </div>

    <input
      v-else
      class="a5e-ability-score__value a5e-ability-score__value--ac"
      name="data.attributes.ac"
      type="number"
      :value="data.data.attributes.ac"
      placeholder="10"
      data-dtype="Number"
    />
  </li>
</template>

<script>
import { inject } from "vue";

export default {
  props: { sheetIsLocked: Boolean },
  setup() {
    const data = inject("data");
    return {
      data,
      localize: (key) => game.i18n.localize(key),
    };
  },
};
</script>
