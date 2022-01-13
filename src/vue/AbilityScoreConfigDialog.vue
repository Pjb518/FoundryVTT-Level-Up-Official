<template>
  <form @submit.prevent="onSubmit" class="a5e-form a5e-form--reactive-dialog">
    <section>
      <h2 class="a5e-heading a5e-heading--form">Ability Check Configuration</h2>

      <expertise-die-picker
        :appId="appId"
        baseId="-check-expertise-"
        :initialSelection="baseCheckExpertiseLevel"
        @updateSelection="updateCheckExpertiseDie"
      />

      <formula-field
        :hasInitialFocus="true"
        :initialValue="checkBonus"
        :inline="true"
        :heading="checkBonusHeading"
        @update-field-value="updateCheckBonus"
      />

      <formula-field
        :initialValue="globalCheckBonus"
        :inline="true"
        heading="A5E.AbilityCheckBonusGlobal"
        @update-field-value="updateGlobalCheckBonus"
      />
    </section>

    <hr />

    <section>
      <h2 class="a5e-heading a5e-heading--form">Saving Throw Configuration</h2>

      <radio-group
        heading="A5E.Proficiency"
        :baseId="appId"
        :initialSelection="saveProficiency"
        :values="proficiencyOptions"
        :wide="true"
        @updateSelection="updateSaveProficiency"
      />

      <expertise-die-picker
        :appId="appId"
        baseId="-save-expertise-"
        :initialSelection="baseSaveExpertiseLevel"
        @updateSelection="updateSaveExpertiseDie"
      />

      <formula-field
        :initialValue="saveBonus"
        :inline="true"
        :heading="saveBonusHeading"
        @update-field-value="updateSaveBonus"
      />

      <formula-field
        :initialValue="globalSaveBonus"
        :inline="true"
        heading="A5E.SavingThrowBonusGlobal"
        @update-field-value="updateGlobalSaveBonus"
      />

      <formula-field
        v-if="ability === 'con'"
        :initialValue="concentrationBonus"
        :inline="true"
        heading="A5E.ConcentrationCheckBonus"
        @update-field-value="updateConcentrationBonus"
      />
    </section>

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
    const { actor, ability, appWindow } = context.attrs;
    const actorData = actor.data.data;
    const abilityData = actorData.abilities[ability];
    const rollData = actor.getRollData();
    const appId = appWindow.id;

    const checkBonus = ref(abilityData?.check.bonus);
    const globalCheckBonus = ref(actorData.bonuses.abilities.check);
    const saveBonus = ref(abilityData?.save.bonus);
    const globalSaveBonus = ref(actorData.bonuses.abilities.save);
    const saveProficiency = ref(abilityData.save.proficient);

    const concentrationBonus = ref(
      actorData.abilities.con.save.concentrationBonus
    );

    const checkExpertise = ref(null);
    const saveExpertise = ref(null);

    function updateCheckBonus(value) {
      checkBonus.value = value;
    }

    function updateGlobalCheckBonus(value) {
      globalCheckBonus.value = value;
    }

    function updateSaveBonus(value) {
      saveBonus.value = value;
    }

    function updateGlobalSaveBonus(value) {
      globalSaveBonus.value = value;
    }

    function updateConcentrationBonus(value) {
      concentrationBonus.value = value;
    }

    function updateCheckExpertiseDie(diceQuantity) {
      checkExpertise.value = diceQuantity;
    }

    function updateSaveExpertiseDie(diceQuantity) {
      saveExpertise.value = diceQuantity;
    }

    function updateSaveProficiency(value) {
      saveProficiency.value = value;
    }

    function onSubmit() {
      const data = {};
      const basePath = `data.abilities.${ability}`;

      data[`${basePath}.check.bonus`] = checkBonus.value;
      data[`${basePath}.check.expertiseDice`] = checkExpertise.value;
      data[`${basePath}.save.bonus`] = saveBonus.value;
      data[`${basePath}.save.expertiseDice`] = saveExpertise.value;
      data[`${basePath}.save.proficient`] = saveProficiency.value;

      data["data.bonuses.abilities.check"] = globalCheckBonus.value;
      data["data.bonuses.abilities.save"] = globalSaveBonus.value;

      if (ability === "con") {
        data["data.abilities.con.save.concentrationBonus"] =
          concentrationBonus.value;
      }

      actor.update(data);
      appWindow.submit();
    }

    return {
      ability,
      appId,
      baseCheckExpertiseLevel: abilityData.check.expertiseDice,
      baseSaveExpertiseLevel: abilityData.save.expertiseDice,
      concentrationBonus,
      checkBonus,
      checkBonusHeading: game.i18n.format("A5E.AbilityCheckBonus", {
        ability: game.i18n.localize(CONFIG.A5E.abilities[ability]),
      }),
      globalCheckBonus,
      globalSaveBonus,
      proficiencyOptions: [
        {
          id: 1,
          name: game.i18n.localize("A5E.ProficiencyProficient"),
          value: true,
        },
        {
          id: 0,
          name: game.i18n.localize("A5E.ProficiencyNone"),
          value: false,
        },
      ],
      saveBonus,
      saveBonusHeading: game.i18n.format("A5E.SavingThrowBonus", {
        ability: game.i18n.localize(CONFIG.A5E.abilities[ability]),
      }),
      saveProficiency,
      updateCheckBonus,
      updateSaveBonus,
      updateConcentrationBonus,
      updateCheckExpertiseDie,
      updateGlobalCheckBonus,
      updateGlobalSaveBonus,
      updateSaveExpertiseDie,
      updateSaveProficiency,
      onSubmit,
      submitText: game.i18n.localize("A5E.SaveSubmit"),
    };
  },
};
</script>
