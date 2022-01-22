<template>
  <form @submit.prevent="onSubmit" class="a5e-form a5e-form--reactive-dialog">
    <numeric-field
      :hasInitialFocus="true"
      :initialValue="maneuverDCBonus"
      heading="A5E.ManeuverDCBonus"
      @update-field-value="updateManeuverDCBonus"
    />

    <div class="a5e-form__section a5e-form__section--inline">
      <label class="a5e-form__input-label a5e-form__input-label--inline">
        {{ exertionRecoveryLabel }}
      </label>

      <div class="a5e-input-container a5e-input-container--inline-wide">
        <input type="checkbox" v-model="recoverExertionOnRest" />
      </div>
    </div>

    <button class="a5e-button" type="submit">
      <i class="fas fa-save"></i> {{ submitText }}
    </button>
  </form>
</template>

<script>
import NumericField from "./partials/NumericField.vue";
import TagGroup from "./partials/TagGroup.vue";

import { ref } from "vue";

export default {
  components: { NumericField, TagGroup },
  setup(_, context) {
    const { actor, appWindow } = context.attrs;
    const actorData = actor.data.data;

    const maneuverDCBonus = ref(actorData.bonuses.maneuverDC || 0);
    const recoverExertionOnRest = ref(
      actorData.attributes.exertion.recoverOnRest
    );

    function updateManeuverDCBonus(value) {
      maneuverDCBonus.value = value;
    }

    async function onSubmit() {
      actor.update({
        "data.attributes.exertion.recoverOnRest": recoverExertionOnRest.value,
        "data.bonuses.maneuverDC": maneuverDCBonus.value,
      });

      appWindow.submit();
    }

    return {
      exertionRecoveryLabel: game.i18n.localize(
        "A5E.ExertionRecoveryConfigPrompt"
      ),
      maneuverDCBonus: actorData.bonuses.maneuverDC || 0,
      onSubmit,
      recoverExertionOnRest,
      submitText: game.i18n.localize("A5E.SaveSubmit"),
      updateManeuverDCBonus,
    };
  },
};
</script>
