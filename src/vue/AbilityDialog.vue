<template>
  <form @submit.prevent="onSubmit" class="a5e-form a5e-form--reactive-dialog">
    <error-list v-if="errors.length" :errors="errors" />

    <radio-group
      heading="A5E.RollModeHeading"
      :baseId="appId"
      :initialSelection="initialRollMode"
      :values="rollModeOptions"
      :wide="true"
      @updateSelection="updateRollMode"
    />

    <expertise-die-picker
      :appId="appId"
      :initialSelection="baseExpertiseLevel"
      @updateSelection="updateExpertiseDie"
    />

    <radio-group
      v-if="isConSave"
      heading="A5E.SavingThrowType"
      :baseId="appId"
      :initialSelection="false"
      :values="concentrationCheckValues"
      :wide="true"
      @updateSelection="toggleConcentrationCheck"
    />

    <formula-field
      :hasInitialFocus="true"
      :reduceMargin="true"
      heading="A5E.SituationalMods"
      @update-field-value="updateSituationalMods"
    />

    <roll-formula-preview :rollFormula="rollFormula" />

    <button class="a5e-button" type="submit" :disabled="!rollFormulaIsValid">
      <i class="fas fa-dice-d20"></i> {{ submitText }}
    </button>
  </form>
</template>

<script>
import ErrorList from "./partials/ErrorList.vue";
import ExpertiseDiePicker from "./partials/ExpertiseDiePicker.vue";
import FormulaField from "./partials/FormulaField.vue";
import RadioGroup from "./partials/RadioGroup.vue";
import RollFormulaPreview from "./partials/RollFormulaPreview.vue";

import A5E from "../modules/config";
import constructRollFormula from "../modules/dice/constructRollFormula";
import getExpertiseDieSize from "../modules/utils/getExpertiseDieSize";
import validateTerms from "../modules/utils/validateTerms";

import { ref, watch } from "vue";

export default {
  components: {
    ErrorList,
    ExpertiseDiePicker,
    FormulaField,
    RadioGroup,
    RollFormulaPreview,
  },
  setup(_, context) {
    const { actor, ability, isSave, appWindow } = context.attrs;
    const actorData = actor.data.data;
    const abilityData = actorData.abilities[ability];
    const rollData = actor.getRollData();
    const appId = appWindow.id;

    const abilityBonus = abilityData?.[isSave ? "save" : "check"].bonus;
    const abilityMod = abilityData?.[isSave ? "save" : "check"].mod;
    const concentrationBonus = actorData.abilities.con.save.concentrationBonus;
    const globalCheckBonus = actorData.bonuses.abilities.check;
    const globalSaveBonus = actorData.bonuses.abilities.save;

    const concentrationCheckValues = [
      {
        name: game.i18n.localize("A5E.SavingThrowNormal"),
        id: "-standard-saving-throw",
        value: false,
      },
      {
        name: game.i18n.localize("A5E.ConcentrationCheck"),
        id: "-concentration-check",
        value: true,
      },
    ];

    const rollModeOptions = Object.entries(CONFIG.A5E.rollModes).map(
      ([key, value]) => ({
        id: key,
        value: CONFIG.A5E.ROLL_MODE[key.toUpperCase()],
        name: game.i18n.localize(value),
      })
    );

    const isConcentrationCheck = ref(false);
    const errors = ref([]);
    const expertiseDie = ref("");
    const rollFormula = ref("");
    const rollFormulaIsValid = ref(true);
    const rollMode = ref(CONFIG.A5E.ROLL_MODE.NORMAL);
    const situationalMods = ref("");

    function toggleConcentrationCheck(value) {
      isConcentrationCheck.value = value;
    }

    function updateExpertiseDie(diceQuantity) {
      expertiseDie.value = getExpertiseDieSize(diceQuantity);
    }

    function updateRollMode(value) {
      rollMode.value = value;
    }

    function updateSituationalMods(mods) {
      situationalMods.value = mods;
    }

    function onSubmit() {
      appWindow.submit({
        formula: rollFormula.value,
      });
    }

    watch(
      isConcentrationCheck,
      (isConcentrationCheck) => {
        // An array of roll formula components that may have invalid values. Each value has an
        // associated error message that has been localized.
        const vulnerableTerms = [
          {
            value: abilityBonus,
            message: game.i18n.format("A5E.ErrorInvalidAbilityCheckBonus", {
              ability: game.i18n.localize(A5E.abilities[ability]),
            }),
          },
        ];

        // Only show saving throw or ability check errors for global bonuses when the user is
        // making the appropriate roll type.
        if (isSave) {
          vulnerableTerms.push({
            value: globalSaveBonus,
            message: game.i18n.localize(
              "A5E.ErrorInvalidGlobalSavingThrowBonus"
            ),
          });
        } else {
          vulnerableTerms.push({
            value: globalCheckBonus,
            message: game.i18n.localize(
              "A5E.ErrorInvalidGlobalAbilityCheckBonus"
            ),
          });
        }

        // Only show errors relating to concentration check bonuses when the user is attempting to
        // roll a concentration check.
        if (isConcentrationCheck) {
          vulnerableTerms.push({
            value: concentrationBonus,
            message: game.i18n.localize("A5E.ErrorInvalidConcentrationBonus"),
          });
        }

        errors.value = validateTerms(vulnerableTerms);
      },
      { immediate: true }
    );

    watch(
      [expertiseDie, isConcentrationCheck, rollMode, situationalMods],
      ([expertiseDie, isConcentrationCheck, rollMode, situationalMods]) => {
        let d20 = "1d20";

        if (rollMode === CONFIG.A5E.ROLL_MODE.ADVANTAGE) d20 = "2d20kh";
        else if (rollMode === CONFIG.A5E.ROLL_MODE.DISADVANTAGE) d20 = "2d20kl";

        try {
          const terms = [d20, expertiseDie, abilityMod, abilityBonus];

          if (isConcentrationCheck) terms.push(concentrationBonus);

          if (isSave) terms.push(globalSaveBonus);
          else terms.push(globalCheckBonus);

          terms.push(situationalMods);
          const formula = constructRollFormula(terms, rollData);

          rollFormula.value = formula;
          rollFormulaIsValid.value = true;
        } catch {
          rollFormula.value = game.i18n.localize("A5E.ErrorInvalidFormula");
          rollFormulaIsValid.value = false;
        }
      }
    );

    return {
      appId,
      baseExpertiseLevel: abilityData[isSave ? "save" : "check"].expertiseDice,
      concentrationCheckValues,
      errors,
      initialRollMode: CONFIG.A5E.ROLL_MODE.NORMAL,
      isConcentrationCheck,
      isConSave: isSave && ability === "con",
      onSubmit,
      rollFormula,
      rollFormulaIsValid,
      rollModeOptions,
      submitText: game.i18n.localize("A5E.DialogSubmitRoll"),
      toggleConcentrationCheck,
      updateExpertiseDie,
      updateRollMode,
      updateSituationalMods,
    };
  },
};
</script>
