<template>
  <div class="u-flex u-flex-col u-gap-md">
    <form-section>
      <div class="u-align-center u-flex u-gap-md">
        <input
          class="u-pointer"
          type="checkbox"
          :name="`data.abilities.${ability}.save.proficient`"
          :id="`${appId}-proficient`"
          :checked="data.data.abilities[ability].save.proficient"
        />

        <label class="u-pointer" :for="`${appId}-proficient`">
          {{ localize("A5E.ProficiencyProficient") }}
        </label>
      </div>
    </form-section>

    <form-section heading="A5E.ExpertiseDie">
      <radio-group
        listClasses="a5e-radio-group--expertise u-gap-md u-mb-md u-text-sm"
        optionClasses="u-p-md u-text-center u-w-12"
        :document="actor"
        :options="expertiseDiceOptions"
        :updatePath="`data.abilities.${ability}.save.expertiseDice`"
      />
    </form-section>

    <form-section
      :heading="saveBonusHeading"
      hint="This field accepts any values valid in roll formulae."
    >
      <div class="u-w-full">
        <input
          class="a5e-input"
          type="text"
          :name="`data.abilities.${ability}.save.bonus`"
          :value="data.data.abilities[ability].save.bonus"
        />
      </div>
    </form-section>

    <form-section
      v-if="ability === 'con'"
      heading="A5E.ConcentrationCheckBonus"
      hint="This field accepts any values valid in roll formulae."
    >
      <div class="u-w-full">
        <input
          class="a5e-input"
          type="text"
          name="data.abilities.con.save.concentrationBonus"
          :value="data.data.abilities.con.save.concentrationBonus"
        />
      </div>
    </form-section>

    <form-section
      heading="A5E.SavingThrowBonusGlobal"
      hint="This bonus is added to all saving throw modifiers. This field accepts any values valid in roll formulae."
    >
      <div class="u-w-full">
        <input
          class="a5e-input"
          type="text"
          name="data.bonuses.abilities.save"
          :value="data.data.bonuses.abilities.save"
        />
      </div>
    </form-section>
  </div>
</template>

<script>
import { inject } from "vue";

import prepareExpertiseDiceOptions from "../../utils/dataPreparationHelpers/prepareExpertiseDiceOptions";

import FormSection from "../../forms/FormSection.vue";
import RadioGroup from "../../forms/RadioGroup.vue";

export default {
  components: { FormSection, RadioGroup },
  setup() {
    const ability = inject("ability");
    const actor = inject("actor");
    const data = inject("data");
    const dialog = inject("dialog");

    const expertiseDiceOptions = prepareExpertiseDiceOptions();

    return {
      ability,
      actor,
      appId: dialog.id,
      data,
      expertiseDiceOptions,
      localize: (key) => game.i18n.localize(key),
      saveBonusHeading: game.i18n.format("A5E.SavingThrowBonus", {
        ability: game.i18n.localize(CONFIG.A5E.abilities[ability]),
      }),
    };
  },
};
</script>
