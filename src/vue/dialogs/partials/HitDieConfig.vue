<template>
  <div class="a5e-hit-die" :class="`a5e-hit-die--${dieSize}`">
    <span class="a5e-hit-die__label">{{ dieSize }}</span>
  </div>

  <div class="a5e-hit-die__input-container">
    <input
      class="a5e-hit-die__quantity"
      type="number"
      data-dtype="Number"
      min="0"
      :name="`data.attributes.hitDice.${dieSize}.current`"
      :value="current"
    />
    /
    <input
      class="a5e-hit-die__quantity"
      data-dtype="Number"
      type="number"
      min="0"
      :name="`data.attributes.hitDice.${dieSize}.total`"
      :value="total"
    />
  </div>
</template>

<script>
export default {
  props: { dieSize: String, current: Number, total: Number },
  setup() {},
};
</script>
