<template>
  <div class="a5e-death-saves">
    <i class="fas fa-check"></i>

    <input
      class="a5e-death-saves__input"
      type="number"
      name="data.attributes.death.success"
      data-dtype="Number"
      placeholder="0"
      min="0"
      :value="success"
    />

    <i
      class="a5e-death-saves__icon fas fa-skull a5e-js-roll-death-saving-throw"
    ></i>

    <input
      class="a5e-death-saves__input"
      type="number"
      name="data.attributes.death.failure"
      data-dtype="Number"
      placeholder="0"
      min="0"
      :value="failure"
    />

    <i class="fas fa-times"></i>
  </div>
</template>

<script>
export default {
  props: { success: Number, failure: Number },
};
</script>
