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
      initialSelection="dex"
      @update-selected-ability="updateSelectedAbility"
    />

    <skill-picker :appId="appId" @update-selected-skill="updateSelectedSkill" />

    <expertise-die-picker
      :appId="appId"
      :initialSelection="baseExpertiseDie"
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
import FormulaField from "./partials/FormulaField.vue";
import RadioGroup from "./partials/RadioGroup.vue";
import RollFormulaPreview from "./partials/RollFormulaPreview.vue";
import SkillPicker from "./partials/SkillPicker.vue";

import A5E from "../modules/config";
import constructRollFormula from "../modules/dice/constructRollFormula";
import getExpertiseDieSize from "../modules/utils/getExpertiseDieSize";
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
    SkillPicker,
  },
  setup(_, context) {
    const { actor, appWindow } = context.attrs;
    const actorData = actor.data.data;
    const initiativeData = actorData.attributes.initiative;
    const rollData = actor.getRollData();
    const appId = appWindow.id;

    const abilityBonus = ref("");
    const abilityMod = ref(actorData.abilities.dex.check.mod);
    const skillBonus = ref(actorData.abilities.dex.check.bonus);
    const skillMod = ref("");
    const globalCheckBonus = actorData.bonuses.abilities.check;
    const globalSkillBonus = actorData.bonuses.abilities.skill;

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
    const selectedSkill = ref(null);
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

    function updateSelectedSkill(skill) {
      selectedSkill.value = skill;
    }

    function updateSituationalMods(mods) {
      situationalMods.value = mods;
    }

    function onSubmit() {
      appWindow.submit({
        formula: rollFormula.value,
      });
    }

    watch(selectedAbility, (selectedAbility) => {
      const ability = actorData.abilities[selectedAbility];
      abilityBonus.value = ability?.check.bonus;
      abilityMod.value = ability?.check.mod;
    });

    watch(selectedSkill, (selectedSkill) => {
      const skill = actorData.skills[selectedSkill];
      skillBonus.value = skill?.bonuses.check;
      skillMod.value = skill?.mod;
    });

    watch(
      [selectedAbility, selectedSkill],
      (selectedAbility, selectedSkill) => {
        // An array of roll formula components that may have invalid values. Each value has an
        // associated error message that has been localized.
        const vulnerableTerms = [
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
          {
            value: globalSkillBonus,
            message: game.i18n.localize("A5E.ErrorInvalidGlobalSkillBonus"),
          },
          {
            value: skillBonus.value,
            message: game.i18n.format("A5E.ErrorInvalidSkillBonus", {
              skill: game.i18n.localize(A5E.skills[selectedSkill]),
            }),
          },
        ];

        errors.value = validateTerms(vulnerableTerms);
      },
      { immediate: true }
    );

    watch(
      [expertiseDie, rollMode, selectedAbility, selectedSkill, situationalMods],
      ([
        expertiseDie,
        rollMode,
        selectedAbility,
        selectedSkill,
        situationalMods,
      ]) => {
        let d20 = "1d20";

        if (rollMode === CONFIG.A5E.ROLL_MODE.ADVANTAGE) d20 = "2d20kh";
        else if (rollMode === CONFIG.A5E.ROLL_MODE.DISADVANTAGE) d20 = "2d20kl";

        try {
          const formula = constructRollFormula(
            [
              d20,
              expertiseDie,
              initiativeData.bonus,
              skillMod.value,
              abilityMod.value,
              globalSkillBonus,
              abilityBonus.value,
              skillBonus.value,
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
      baseExpertiseDie: initiativeData.expertiseDice,
      errors,
      initialRollMode: CONFIG.A5E.ROLL_MODE.NORMAL,
      localize: (key) => game.i18n.localize(key),
      onSubmit,
      rollFormula,
      rollFormulaIsValid: true,
      rollModeOptions,
      submitText: game.i18n.localize("A5E.DialogSubmitRoll"),
      updateExpertiseDie,
      updateRollMode,
      updateSelectedAbility,
      updateSelectedSkill,
      updateSituationalMods,
    };
  },
};
</script>
