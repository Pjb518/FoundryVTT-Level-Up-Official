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

    <div
      class="
        a5e-death-saves__icon
        u-align-center u-flex u-flex-col u-pos-relative
      "
    >
      <i
        class="fas fa-skull a5e-js-roll-death-saving-throw"
        @click="onRollDeathSavingThrow"
      ></i>

      <div class="a5e-tooltip a5e-tooltip--death-save">
        {{ localize("A5E.DeathSavingThrowRoll") }}
      </div>
    </div>

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
import { inject } from "vue";

export default {
  props: { success: Number, failure: Number },
  setup() {
    const actor = inject("actor");

    function onRollDeathSavingThrow() {
      actor.rollDeathSavingThrow();
    }

    return {
      localize: (key) => game.i18n.localize(key),
      onRollDeathSavingThrow,
    };
  },
};
</script>
