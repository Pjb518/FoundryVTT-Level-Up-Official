<template>
  <form
    @submit.prevent="onSubmit"
    class="a5e-form u-py-lg u-px-xl a5e-form--reactive-dialog u-bg-none"
  >
    <error-list v-if="errors.length" :errors="errors" />

    <section class="a5e-form__section u-flex u-flex-col u-gap-md">
      <h3 class="u-text-bold u-text-sm">
        {{ localize("A5E.RollModeHeading") }}
      </h3>

      <radio-group
        :baseId="appId"
        :initialSelection="initialRollMode"
        :values="rollModeOptions"
        :wide="true"
        :wrap="false"
        @updateSelection="updateRollMode"
      />
    </section>

    <ability-score-picker
      :appId="appId"
      @update-selected-ability="updateSelectedAbility"
    />

    <expertise-die-picker
      :appId="appId"
      :initialSelection="baseExpertiseLevel"
      @updateSelection="updateExpertiseDie"
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
import AbilityScorePicker from "./partials/AbilityScorePicker.vue";
import ErrorList from "./partials/ErrorList.vue";
import ExpertiseDiePicker from "./partials/ExpertiseDiePicker.vue";
import RadioGroup from "./partials/RadioGroup.vue";
import RollFormulaPreview from "./partials/RollFormulaPreview.vue";
import FormulaField from "./partials/FormulaField.vue";

import A5E from "../modules/config";
import getExpertiseDieSize from "../modules/utils/getExpertiseDieSize";
import constructRollFormula from "../modules/dice/constructRollFormula";
import validateTerms from "../modules/utils/validateTerms";

import { ref, watch } from "vue";

export default {
  components: {
    AbilityScorePicker,
    ErrorList,
    ExpertiseDiePicker,
    FormulaField,
    RadioGroup,
    RollFormulaPreview,
  },
  setup(_, context) {
    const { actor, skill, appWindow } = context.attrs;
    const actorData = actor.data.data;
    const rollData = actor.getRollData();
    const skillData = actorData.skills[skill];
    const appId = appWindow.id;

    const abilityBonus = ref("");
    const abilityMod = ref("");
    const globalCheckBonus = actorData.bonuses.abilities.check;
    const globalSkillBonus = actorData.bonuses.abilities.skill;
    const minRoll = skillData.minRoll;
    const skillBonus = skillData.bonuses.check;
    const skillMod = skillData.mod;

    const rollModeOptions = Object.entries(CONFIG.A5E.rollModes).map(
      ([key, value]) => ({
        id: key,
        value: CONFIG.A5E.ROLL_MODE[key.toUpperCase()],
        name: game.i18n.localize(value),
      })
    );

    const errors = ref([]);
    const expertiseDie = ref("");
    const selectedAbility = ref(null);
    const situationalMods = ref("");
    const rollFormula = ref("");
    const rollFormulaIsValid = ref(true);
    const rollMode = ref(CONFIG.A5E.ROLL_MODE.NORMAL);

    function updateExpertiseDie(diceQuantity) {
      expertiseDie.value = getExpertiseDieSize(diceQuantity);
    }

    function updateRollMode(value) {
      rollMode.value = value;
    }

    function updateSelectedAbility(ability) {
      selectedAbility.value = ability;
    }

    function updateSituationalMods(mods) {
      situationalMods.value = mods;
    }

    function onSubmit() {
      appWindow.submit({
        formula: rollFormula.value,
        ability: selectedAbility.value,
      });
    }

    watch(
      selectedAbility,
      (selectedAbility) => {
        const ability = actorData.abilities[selectedAbility];
        abilityBonus.value = ability?.check.bonus;
        abilityMod.value = ability?.check.mod;

        // An array of roll formula components that may have invalid values. Each value has an
        // associated error message that has been localized.
        const vulnerableTerms = [
          {
            value: skillBonus,
            message: game.i18n.format("A5E.ErrorInvalidSkillBonus", {
              skill: game.i18n.localize(A5E.skills[skill]),
            }),
          },
          {
            value: globalSkillBonus,
            message: game.i18n.localize("A5E.ErrorInvalidGlobalSkillBonus"),
          },
          {
            value: abilityBonus.value,
            message: game.i18n.format("A5E.ErrorInvalidAbilityCheckBonus", {
              ability: game.i18n.localize(A5E.abilities[selectedAbility]),
            }),
          },
          {
            value: globalCheckBonus,
            message: game.i18n.localize(
              "A5E.ErrorInvalidGlobalAbilityCheckBonus"
            ),
          },
        ];

        errors.value = validateTerms(vulnerableTerms);
      },
      { immediate: true }
    );

    watch(
      [expertiseDie, rollMode, selectedAbility, situationalMods],
      ([expertiseDie, rollMode, _, situationalMods]) => {
        const d20Parts = ["d20"];

        if (minRoll > 1) d20Parts.push(`min${minRoll}`);

        if (rollMode === CONFIG.A5E.ROLL_MODE.ADVANTAGE) {
          d20Parts.unshift("2");
          d20Parts.push("kh");
        } else if (rollMode === CONFIG.A5E.ROLL_MODE.DISADVANTAGE) {
          d20Parts.unshift("2");
          d20Parts.push("kl");
        } else {
          d20Parts.unshift("1");
        }

        const d20 = d20Parts.join("");

        try {
          const formula = constructRollFormula(
            [
              d20,
              expertiseDie,
              skillMod,
              abilityMod.value,
              skillBonus,
              globalSkillBonus,
              abilityBonus.value,
              globalCheckBonus,
              situationalMods,
            ],
            rollData
          );

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
      baseExpertiseLevel: skillData.expertiseDice,
      errors,
      initialRollMode: CONFIG.A5E.ROLL_MODE.NORMAL,
      localize: (key) => game.i18n.localize(key),
      onSubmit,
      rollFormula,
      rollFormulaIsValid,
      rollModeOptions,
      submitText: game.i18n.localize("A5E.DialogSubmitRoll"),
      updateExpertiseDie,
      updateRollMode,
      updateSelectedAbility,
      updateSituationalMods,
    };
  },
};
</script>
