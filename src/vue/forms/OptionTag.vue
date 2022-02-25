<template>
  <li
    class="a5e-tag u-pointer"
    :class="[{ 'a5e-tag--inactive': !selected }, classes]"
    @click="$emit('option-selected', value)"
  >
    {{ localize(label) }}
  </li>
</template>

<script>
export default {
  emits: ["option-selected"],
  props: {
    classes: { type: String, default: "" },
    label: String,
    value: [Boolean, String, Number],
    selected: { type: Boolean, default: false },
  },
  setup() {
    return {
      localize: (key) => game.i18n.localize(key),
    };
  },
};
</script>
