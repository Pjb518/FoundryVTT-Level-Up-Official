<template>
  <form
    @submit.prevent="onSubmit"
    class="a5e-form u-py-lg u-px-xl a5e-form--reactive-dialog u-bg-none"
  >
    <template v-if="hasAttackRoll">
      <section class="a5e-form__section u-flex u-flex-col u-gap-md">
        <h3 class="u-text-bold u-text-sm">
          {{ localize("A5E.RollModeHeading") }}
        </h3>

        <radio-group
          :baseId="appId"
          :initialSelection="rollMode"
          :values="rollModeOptions"
          :wide="true"
          :wrap="false"
          @updateSelection="updateRollMode"
        />
      </section>

      <expertise-die-picker
        heading="A5E.ExpertiseDieAttackRoll"
        :appId="appId"
        :initialSelection="baseExpertiseLevel"
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
      :initialSelections="defaultDamageSelection"
      :sort="false"
      :tags="damageTags"
      @updateSelectionList="updateSelectedDamageGroups"
    />

    <tag-group
      v-if="hasHealing"
      heading="A5E.HealingOptionsPrompt"
      :initialSelections="defaultHealingSelection"
      :sort="false"
      :tags="healingTags"
      @updateSelectionList="updateSelectedHealingGroups"
    />

    <section
      v-if="hasTemplate"
      class="a5e-form__section u-align-center u-flex u-gap-md"
    >
      <input
        class="u-pointer"
        type="checkbox"
        style="margin-left: 0"
        :id="`${appId}-place-template`"
        ref="inputField"
        v-model="placeTemplate"
      />

      <label class="u-pointer" :for="`${appId}-place-template`">
        {{ localize("A5E.ItemPlaceTemplate") }}
      </label>
    </section>

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
    const { actor, item, appWindow, ...overrides } = context.attrs;
    const appId = appWindow.id;
    const actorData = actor.data.data;
    const itemData = item.data.data;

    const rollData = actor.getRollData();
    rollData.mod = actorData.abilities[item.abilityMod]?.check.mod || 0;

    const { actionOptions, attack, damage, healing } = itemData;
    const abilityMod = actorData.abilities[item.abilityMod]?.check.mod;
    const addProficiencyBonus = itemData.proficient;
    const hasAttackRoll = actionOptions.includes("attack");
    const hasDamage = actionOptions.includes("damage");
    const hasHealing = actionOptions.includes("healing");

    const damageTags = Object.fromEntries(
      damage.map(({ name }, i) => [
        i,
        name?.trim() || `${game.i18n.localize("A5E.Damage")} #${i + 1}`,
      ])
    );

    const defaultDamageSelection = damage.reduce((acc, curr, i) => {
      if (curr.defaultSelection ?? true) acc.push(i.toString());
      return acc;
    }, []);

    const healingTags = Object.fromEntries(
      healing.map(({ name }, i) => [
        i,
        name?.trim() || `${game.i18n.localize("A5E.Healing")} #${i + 1}`,
      ])
    );

    const defaultHealingSelection = healing.reduce((acc, curr, i) => {
      if (curr.defaultSelection ?? true) acc.push(i.toString());
      return acc;
    }, []);

    const rollModeOptions = Object.entries(CONFIG.A5E.rollModes).map(
      ([key, value]) => ({
        id: key,
        value: CONFIG.A5E.ROLL_MODE[key.toUpperCase()],
        name: game.i18n.localize(value),
      })
    );

    const expertiseDie = ref("");
    const placeTemplateDefault = ref(item.getFlag("a5e", "placeTemplate"));
    const placeTemplate = ref(placeTemplateDefault.value);
    const rollFormula = ref("");
    const rollFormulaIsValid = ref(true);
    const rollMode = ref(overrides.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL);
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
        placeTemplate: placeTemplate.value,
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
      baseExpertiseLevel: overrides.expertiseDice ?? 0,
      damageTags,
      defaultDamageSelection,
      defaultHealingSelection,
      hasAttackRoll,
      hasDamage,
      hasHealing,
      hasTemplate: itemData.area.shape,
      healingTags,
      localize: (key) => game.i18n.localize(key),
      onSubmit,
      placeTemplate,
      placeTemplateDefault,
      rollFormula,
      rollFormulaIsValid,
      rollMode,
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
