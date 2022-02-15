<template>
  <form @submit.prevent="onSubmit" class="a5e-form a5e-form--reactive-dialog">
    <template v-if="hasAttackRoll">
      <section class="a5e-form__section">
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

      <expertise-die-picker
        heading="A5E.ExpertiseDieAttackRoll"
        :appId="appId"
        :initialSelection="0"
        @updateSelection="updateExpertiseDie"
      />

      <formula-field
        :hasInitialFocus="true"
        :reduceMargin="true"
        heading="A5E.SituationalModsAttackRoll"
        @update-field-value="updateSituationalMods"
      />

      <roll-formula-preview :rollFormula="rollFormula" />
    </template>

    <tag-group
      v-if="hasDamage"
      heading="A5E.DamageOptionsPrompt"
      :initialSelections="Object.keys(damageTags)"
      :sort="false"
      :tags="damageTags"
      @updateSelectionList="updateSelectedDamageGroups"
    />

    <tag-group
      v-if="hasHealing"
      heading="A5E.HealingOptionsPrompt"
      :initialSelections="Object.keys(healingTags)"
      :sort="false"
      :tags="healingTags"
      @updateSelectionList="updateSelectedHealingGroups"
    />

    <button class="a5e-button" type="submit" :disabled="!rollFormulaIsValid">
      <i class="fas fa-dice-d20"></i> {{ submitText }}
    </button>
  </form>
</template>

<script>
import ExpertiseDiePicker from "./partials/ExpertiseDiePicker.vue";
import FormulaField from "./partials/FormulaField.vue";
import RadioGroup from "./partials/RadioGroup.vue";
import RollFormulaPreview from "./partials/RollFormulaPreview.vue";
import TagGroup from "./partials/TagGroup.vue";

import constructRollFormula from "../modules/dice/constructRollFormula";
import getExpertiseDieSize from "../modules/utils/getExpertiseDieSize";

import { ref, watch } from "vue";

export default {
  components: {
    ExpertiseDiePicker,
    FormulaField,
    RadioGroup,
    RollFormulaPreview,
    TagGroup,
  },
  setup(_, context) {
    const { actor, item, appWindow } = context.attrs;
    const appId = appWindow.id;
    const actorData = actor.data.data;
    const itemData = item.data.data;

    const rollData = actor.getRollData();
    rollData.mod = actorData.abilities[itemData.ability]?.check.mod || 0;

    const { actionOptions, ability, attack, damage, healing } = itemData;
    const abilityMod = actorData.abilities[ability]?.check.mod;
    const addProficiencyBonus = itemData.proficient;
    const hasAttackRoll = actionOptions.includes("attack");
    const hasDamage = actionOptions.includes("damage");
    const hasHealing = actionOptions.includes("healing");

    const damageTags = Object.fromEntries(
      damage.map(({ name }, i) => [
        i,
        name.trim() || `${game.i18n.localize("A5E.Damage")} #${i + 1}`,
      ])
    );

    const healingTags = Object.fromEntries(
      healing.map(({ name }, i) => [
        i,
        name.trim() || `${game.i18n.localize("A5E.Healing")} #${i + 1}`,
      ])
    );

    const rollModeOptions = Object.entries(CONFIG.A5E.rollModes).map(
      ([key, value]) => ({
        id: key,
        value: CONFIG.A5E.ROLL_MODE[key.toUpperCase()],
        name: game.i18n.localize(value),
      })
    );

    const expertiseDie = ref("");
    const rollFormula = ref("");
    const rollFormulaIsValid = ref(true);
    const rollMode = ref(CONFIG.A5E.ROLL_MODE.NORMAL);
    const selectedDamageGroups = ref(Object.keys(damageTags));
    const selectedHealingGroups = ref(Object.keys(healingTags));
    const situationalMods = ref("");

    function updateExpertiseDie(diceQuantity) {
      expertiseDie.value = getExpertiseDieSize(diceQuantity);
    }

    function updateRollMode(value) {
      rollMode.value = value;
    }

    function updateSelectedDamageGroups(value) {
      selectedDamageGroups.value = value;
    }

    function updateSelectedHealingGroups(value) {
      selectedHealingGroups.value = value;
    }

    function updateSituationalMods(mods) {
      situationalMods.value = mods;
    }

    function onSubmit() {
      appWindow.submit({
        attack: {
          critThreshold: attack.critThreshold,
          formula: rollFormula.value,
          type: attack.type,
        },
        damage: selectedDamageGroups.value.map((index) => damage[index]),
        healing: selectedHealingGroups.value.map((index) => healing[index]),
      });
    }

    watch(
      [expertiseDie, rollMode, situationalMods],
      ([expertiseDie, rollMode, situationalMods]) => {
        let d20 = "1d20";

        if (rollMode === CONFIG.A5E.ROLL_MODE.ADVANTAGE) d20 = "2d20kh";
        else if (rollMode === CONFIG.A5E.ROLL_MODE.DISADVANTAGE) d20 = "2d20kl";

        try {
          const terms = [
            d20,
            expertiseDie,
            abilityMod,
            attack.bonus,
            situationalMods,
          ];

          if (addProficiencyBonus) terms.push(actorData.prof);

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
      damageTags,
      hasAttackRoll,
      hasDamage,
      hasHealing,
      healingTags,
      initialRollMode: CONFIG.A5E.ROLL_MODE.NORMAL,
      localize: (key) => game.i18n.localize(key),
      onSubmit,
      rollFormula,
      rollFormulaIsValid,
      rollModeOptions,
      submitText: game.i18n.localize("A5E.DialogSubmitRoll"),
      updateExpertiseDie,
      updateRollMode,
      updateSelectedDamageGroups,
      updateSelectedHealingGroups,
      updateSituationalMods,
    };
  },
};
</script>
