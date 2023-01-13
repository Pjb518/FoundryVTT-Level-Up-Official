<template>
  <form
    class="a5e-form u-py-lg u-px-xl a5e-form--reactive-dialog u-bg-none"
    @submit.prevent="onSubmit"
  >
    <error-list v-if="errors.length" :errors="errors" />

    <section class="a5e-form__section u-flex u-flex-col u-gap-md">
      <h3 class="u-text-bold u-text-sm">
        {{ localize('A5E.RollModeHeading') }}
      </h3>

      <radio-group
        :base-id="appId"
        :initial-selection="initialRollMode"
        :values="rollModeOptions"
        :wide="true"
        :wrap="false"
        @update-selection="updateRollMode"
      />
    </section>

    <expertise-die-picker
      :app-id="appId"
      :initial-selection="baseExpertiseLevel"
      @update-selection="updateExpertiseDie"
    />

    <formula-field
      :has-initial-focus="true"
      :reduce-margin="true"
      heading="A5E.SituationalMods"
      @update-field-value="updateSituationalMods"
    />

    <roll-formula-preview :roll-formula="rollFormula" />

    <button class="a5e-button" type="submit" :disabled="!rollFormulaIsValid">
      <i class="fas fa-dice-d20" /> {{ submitText }}
    </button>
  </form>
</template>

<script>
import { ref, watch } from 'vue';
import ErrorList from './partials/ErrorList.vue';
import ExpertiseDiePicker from './partials/ExpertiseDiePicker.vue';
import FormulaField from './partials/FormulaField.vue';
import RadioGroup from './partials/RadioGroup.vue';
import RollFormulaPreview from './partials/RollFormulaPreview.vue';

import A5E from '../modules/config';
import constructRollFormula from '../modules/dice/constructRollFormula';
import getExpertiseDieSize from '../modules/utils/getExpertiseDieSize';
import validateTerms from '../modules/utils/validateTerms';

export default {
  components: {
    ErrorList,
    ExpertiseDiePicker,
    FormulaField,
    RadioGroup,
    RollFormulaPreview
  },
  setup(_, context) {
    const { actor, appWindow, ...overrides } = context.attrs;
    const actorData = actor.system;
    const rollData = actor.getRollData();
    const appId = appWindow.id;
    const globalSaveBonus = actorData.bonuses.abilities.save;

    const rollModeOptions = Object.entries(CONFIG.A5E.rollModes).map(
      ([key, value]) => ({
        id: key,
        value: CONFIG.A5E.ROLL_MODE[key.toUpperCase()],
        name: game.i18n.localize(value)
      })
    );

    const vulnerableTerms = [
      {
        value: globalSaveBonus,
        message: game.i18n.localize('A5E.ErrorInvalidGlobalSavingThrowBonus')
      }
    ];

    const errors = validateTerms(vulnerableTerms);
    const expertiseDie = ref('');
    const rollFormula = ref('');
    const rollFormulaIsValid = ref(true);
    const rollMode = ref(overrides.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL);
    const situationalMods = ref('');

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
        formula: rollFormula.value
      });
    }

    watch(
      [expertiseDie, rollMode, situationalMods],
      ([expertiseDie, rollMode, situationalMods]) => {
        let d20 = '1d20';

        if (rollMode === CONFIG.A5E.ROLL_MODE.ADVANTAGE) d20 = '2d20kh';
        else if (rollMode === CONFIG.A5E.ROLL_MODE.DISADVANTAGE) d20 = '2d20kl';

        try {
          const terms = [d20, expertiseDie, globalSaveBonus, situationalMods];
          const formula = constructRollFormula(terms, rollData);

          rollFormula.value = formula;
          rollFormulaIsValid.value = true;
        } catch {
          rollFormula.value = game.i18n.localize('A5E.ErrorInvalidFormula');
          rollFormulaIsValid.value = false;
        }
      }
    );

    return {
      appId,
      baseExpertiseLevel: overrides.expertiseDice ?? 0,
      errors,
      initialRollMode: CONFIG.A5E.ROLL_MODE.NORMAL,
      localize: (key) => game.i18n.localize(key),
      onSubmit,
      rollFormula,
      rollFormulaIsValid,
      rollModeOptions,
      submitText: game.i18n.localize('A5E.DialogSubmitRoll'),
      updateExpertiseDie,
      updateRollMode,
      updateSituationalMods
    };
  }
};
</script>
