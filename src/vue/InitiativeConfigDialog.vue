<template>
  <form @submit.prevent="onSubmit" class="a5e-form a5e-form--reactive-dialog">
    <expertise-die-picker
      :appId="appId"
      :initialSelection="baseExpertiseLevel"
      @updateSelection="updateExpertiseDie"
    />

    <formula-field
      :initialValue="initiativeBonus"
      :hasInitialFocus="true"
      :inline="true"
      heading="A5E.InitiativeBonus"
      @update-field-value="updateInitiativeBonus"
    />

    <formula-field
      :initialValue="globalCheckBonus"
      :inline="true"
      heading="A5E.AbilityCheckBonusGlobal"
      @update-field-value="updateGlobalCheckBonus"
    />

    <button class="a5e-button" type="submit">
      <i class="fas fa-save"></i> {{ submitText }}
    </button>
  </form>
</template>

<script>
import FormulaField from "./partials/FormulaField.vue";
import ExpertiseDiePicker from "./partials/ExpertiseDiePicker.vue";
import RadioGroup from "./partials/RadioGroup.vue";

import { ref } from "vue";

export default {
  components: { FormulaField, ExpertiseDiePicker, RadioGroup },
  setup(_, context) {
    const { actor, appWindow } = context.attrs;
    const actorData = actor.data.data;
    const initiativeData = actorData.attributes.initiative;
    const rollData = actor.getRollData();
    const appId = appWindow.id;

    const initiativeBonus = ref(initiativeData.bonus);
    const expertiseDie = ref("");
    const globalCheckBonus = ref(actorData.bonuses.abilities.check);

    function updateExpertiseDie(diceQuantity) {
      expertiseDie.value = diceQuantity;
    }

    function updateInitiativeBonus(value) {
      initiativeBonus.value = value;
    }

    function updateGlobalCheckBonus(value) {
      globalCheckBonus.value = value;
    }

    function onSubmit() {
      const data = {};
      const basePath = "data.attributes.initiative";

      data[`${basePath}.expertiseDice`] = expertiseDie.value;
      data[`${basePath}.bonus`] = initiativeBonus.value;

      data["data.bonuses.abilities.check"] = globalCheckBonus.value;

      actor.update(data);
      appWindow.submit();
    }

    return {
      appId,
      baseExpertiseLevel: initiativeData.expertiseDice,
      globalCheckBonus,
      initiativeBonus,
      onSubmit,
      updateExpertiseDie,
      updateGlobalCheckBonus,
      updateInitiativeBonus,
      submitText: game.i18n.localize("A5E.SaveSubmit"),
    };
  },
};
</script>
