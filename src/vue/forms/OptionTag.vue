<template>
  <li
    class="a5e-tag u-pointer"
    :class="{ 'a5e-tag--inactive': !selected }"
    @click="$emit('option-selected', value)"
  >
    {{ localize(label) }}
  </li>
</template>

<script>
export default {
  emits: ["option-selected"],
  props: {
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
