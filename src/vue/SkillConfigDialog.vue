<template>
  <form @submit.prevent="onSubmit" class="a5e-form a5e-form--reactive-dialog">
    <radio-group
      heading="A5E.Proficiency"
      :baseId="appId"
      :initialSelection="proficient"
      :values="proficiencyOptions"
      :wide="true"
      @updateSelection="updateProficiency"
    />

    <tag-group
      heading="A5E.SkillSpecialties"
      :initialSelections="selectedCoreSkillSpecialties"
      :tags="skillSpecialties"
      @updateSelectionList="updateSelectedCoreSpecialties"
    />

    <input-field
      hint="A5E.HintSeparateBySemiColon"
      :hasInitialFocus="true"
      :initialValue="selectedCustomSkillSpecialties"
      @update-field-value="updateSelectedCustomSpecialties"
    />

    <expertise-die-picker
      :appId="appId"
      :initialSelection="baseExpertiseLevel"
      @updateSelection="updateExpertiseDie"
    />

    <formula-field
      :hasInitialFocus="true"
      :initialValue="checkBonus"
      :inline="true"
      :heading="checkBonusHeading"
      @update-field-value="updateCheckBonus"
    />

    <formula-field
      :initialValue="globalSkillCheckBonus"
      :inline="true"
      heading="A5E.SkillCheckBonusGlobal"
      @update-field-value="updateGlobalSkillCheckBonus"
    />

    <formula-field
      :initialValue="globalAbilityCheckBonus"
      :inline="true"
      heading="A5E.AbilityCheckBonusGlobal"
      @update-field-value="updateGlobalAbilityCheckBonus"
    />

    <numeric-field
      heading="A5E.MinimumD20Roll"
      :initialValue="initialMinRollValue"
      :min="1"
      :max="20"
      @update-field-value="updateMinRoll"
    />

    <numeric-field
      :heading="passiveBonusHeading"
      :initialValue="passiveBonus"
      @update-field-value="updatePassiveBonus"
    />

    <button class="a5e-button" type="submit">
      <i class="fas fa-save"></i> {{ submitText }}
    </button>
  </form>
</template>

<script>
import ExpertiseDiePicker from "./partials/ExpertiseDiePicker.vue";
import FormulaField from "./partials/FormulaField.vue";
import InputField from "./partials/InputField.vue";
import NumericField from "./partials/NumericField.vue";
import RadioGroup from "./partials/RadioGroup.vue";
import SelectBox from "./partials/SelectBox.vue";
import TagGroup from "./partials/TagGroup.vue";

import { ref } from "vue";

export default {
  components: {
    ExpertiseDiePicker,
    FormulaField,
    InputField,
    NumericField,
    RadioGroup,
    SelectBox,
    TagGroup,
  },
  setup(_, context) {
    const { actor, skill, appWindow } = context.attrs;
    const actorData = actor.data.data;
    const rollData = actor.getRollData();
    const skillData = actorData.skills[skill];
    const appId = appWindow.id;

    const checkBonus = ref(skillData.bonuses.check);
    const expertiseDie = ref("");
    const globalSkillCheckBonus = ref(actorData.bonuses.abilities.skill);
    const globalAbilityCheckBonus = ref(actorData.bonuses.abilities.check);
    const minRoll = ref(skillData.minRoll);
    const passiveBonus = ref(skillData.bonuses.passive);
    const proficient = ref(skillData.proficient);

    const skillSpecialties = CONFIG.A5E.skillSpecialties[skill];

    const selectedSkillSpecialties = skillData.specialties.reduce(
      (acc, curr) => {
        if (Object.keys(skillSpecialties).includes(curr)) acc.core.push(curr);
        else acc.custom.push(curr);
        return acc;
      },
      { core: [], custom: [] }
    );

    const selectedCoreSkillSpecialties = ref(selectedSkillSpecialties.core);

    const selectedCustomSkillSpecialties = ref(
      selectedSkillSpecialties.custom.join("; ")
    );

    function updateExpertiseDie(diceQuantity) {
      expertiseDie.value = diceQuantity;
    }

    function updateCheckBonus(value) {
      checkBonus.value = value;
    }

    function updateGlobalAbilityCheckBonus(value) {
      globalAbilityCheckBonus.value = value;
    }

    function updateGlobalSkillCheckBonus(value) {
      globalSkillCheckBonus.value = value;
    }

    function updateMinRoll(value) {
      minRoll.value = value;
    }

    function updatePassiveBonus(value) {
      passiveBonus.value = value;
    }

    function updateProficiency(value) {
      proficient.value = value;
    }

    function updateSelectedCoreSpecialties(value) {
      selectedSkillSpecialties.value = value;
    }

    function updateSelectedCustomSpecialties(value) {
      selectedCustomSkillSpecialties.value = value;
    }

    function onSubmit() {
      const specialties = [
        ...selectedCoreSkillSpecialties.value,
        ...selectedCustomSkillSpecialties.value
          .split(";")
          .map((tool) => tool.trim())
          .filter(Boolean),
      ];

      const data = {};
      const basePath = `data.skills.${skill}`;

      data[`${basePath}.bonuses.check`] = checkBonus.value;
      data[`${basePath}.bonuses.passive`] = passiveBonus.value;
      data[`${basePath}.expertiseDice`] = expertiseDie.value;
      data[`${basePath}.minRoll`] = minRoll.value;
      data[`${basePath}.proficient`] = proficient.value;
      data[`${basePath}.specialties`] = specialties;

      data["data.bonuses.abilities.check"] = globalAbilityCheckBonus.value;
      data["data.bonuses.abilities.skill"] = globalSkillCheckBonus.value;

      actor.update(data);
      appWindow.submit();
    }

    return {
      appId,
      baseExpertiseLevel: skillData.expertiseDice,
      checkBonus,
      checkBonusHeading: game.i18n.format("A5E.SkillCheckBonus", {
        skill: game.i18n.localize(CONFIG.A5E.skills[skill]),
      }),
      globalAbilityCheckBonus,
      globalSkillCheckBonus,
      initialMinRollValue: skillData.minRoll,
      onSubmit,
      passiveBonus,
      passiveBonusHeading: game.i18n.format("A5E.SkillCheckBonusPassive", {
        skill: game.i18n.localize(CONFIG.A5E.skills[skill]),
      }),
      proficient,
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
      skillSpecialties,
      selectedCoreSkillSpecialties,
      selectedCustomSkillSpecialties,
      submitText: game.i18n.localize("A5E.SaveSubmit"),
      updateCheckBonus,
      updateExpertiseDie,
      updateGlobalAbilityCheckBonus,
      updateGlobalSkillCheckBonus,
      updateMinRoll,
      updatePassiveBonus,
      updateProficiency,
      updateSelectedCoreSpecialties,
      updateSelectedCustomSpecialties,
    };
  },
};
</script>
