<template>
  <form @submit.prevent="onSubmit" class="a5e-form a5e-form--reactive-dialog">
    <numeric-field
      heading="A5E.HitPointsCurrent"
      :initialValue="currentHP"
      @update-field-value="updateCurrentHitPoints"
    />

    <numeric-field
      heading="A5E.HitPointsBaseMaximum"
      :initialValue="maxHP"
      @update-field-value="updateMaxHitPoints"
    />

    <numeric-field
      heading="A5E.HitPointsTemporary"
      :initialValue="temporaryHP"
      @update-field-value="updateTemporaryHitPoints"
    />

    <numeric-field
      heading="A5E.HitPointsMaxModifier"
      :initialValue="hitPointModifier"
      @update-field-value="updateHitPointModifier"
    />

    <hr class="a5e-rule a5e-rule--form" />

    <div class="a5e-form__section">
      <h3 class="a5e-form__input-label">{{ hitDiceLabel }}</h3>

      <div class="a5e-radio-group">
        <div
          class="a5e-hit-die-wrapper"
          v-for="die in ['d6', 'd8', 'd10', 'd12']"
          :key="die"
        >
          <div class="a5e-hit-die" :class="`a5e-hit-die--${die}`">
            <span class="a5e-hit-die__label">{{ die }}</span>
          </div>

          <div class="a5e-hit-die__input-container">
            <input
              class="a5e-hit-die__quantity"
              type="number"
              min="0"
              v-model="hitDiceCurrent[die].value"
            />
            /
            <input
              class="a5e-hit-die__quantity"
              type="number"
              min="0"
              v-model="hitDiceTotal[die].value"
            />
          </div>
        </div>
      </div>
    </div>

    <button class="a5e-button" type="submit">
      <i class="fas fa-save"></i> {{ submitText }}
    </button>
  </form>
</template>

<script>
import NumericField from "./partials/NumericField.vue";

import { ref } from "vue";

export default {
  components: { NumericField },
  setup(_, context) {
    const { actor, appWindow } = context.attrs;
    const actorData = actor.data.data;
    const hitPointData = actorData.attributes.hp;
    const { hitDice } = actorData.attributes;

    const currentHP = ref(hitPointData.current);
    const maxHP = ref(hitPointData.baseMax);
    const temporaryHP = ref(hitPointData.temp);
    const hitPointModifier = ref(hitPointData.bonus);

    const d6Total = ref(parseInt(hitDice.d6.total || 0, 10));
    const d6Current = ref(parseInt(hitDice.d6.current || 0, 10));

    const d8Total = ref(parseInt(hitDice.d8.total || 0, 10));
    const d8Current = ref(parseInt(hitDice.d8.current || 0, 10));

    const d10Total = ref(parseInt(hitDice.d10.total || 0, 10));
    const d10Current = ref(parseInt(hitDice.d10.current || 0, 10));

    const d12Total = ref(parseInt(hitDice.d12.total || 0, 10));
    const d12Current = ref(parseInt(hitDice.d12.current || 0, 10));

    function updateCurrentHitPoints(value) {
      currentHP.value = value;
    }

    function updateMaxHitPoints(value) {
      maxHP.value = value;
    }

    function updateTemporaryHitPoints(value) {
      temporaryHP.value = value;
    }

    function updateHitPointModifier(value) {
      hitPointModifier.value = value;
    }

    function onSubmit() {
      const data = {
        "data.attributes": {
          hp: {
            current: currentHP.value,
            baseMax: maxHP.value,
            temp: temporaryHP.value,
            bonus: hitPointModifier.value,
          },
          hitDice: {
            d6: { current: d6Current.value, total: d6Total.value },
            d8: { current: d8Current.value, total: d8Total.value },
            d10: { current: d10Current.value, total: d10Total.value },
            d12: { current: d12Current.value, total: d12Total.value },
          },
        },
      };

      actor.update(data);
      appWindow.submit();
    }

    return {
      currentHP,
      hitDiceCurrent: {
        d6: d6Current,
        d8: d8Current,
        d10: d10Current,
        d12: d12Current,
      },
      hitDiceTotal: {
        d6: d6Total,
        d8: d8Total,
        d10: d10Total,
        d12: d12Total,
      },
      hitDiceLabel: game.i18n.localize("A5E.HitDiceLabel"),
      hitPointModifier,
      maxHP,
      onSubmit,
      submitText: game.i18n.localize("A5E.SaveSubmit"),
      temporaryHP,
      updateCurrentHitPoints,
      updateMaxHitPoints,
      updateTemporaryHitPoints,
      updateHitPointModifier,
    };
  },
};
</script>
