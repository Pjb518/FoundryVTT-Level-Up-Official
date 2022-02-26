<template>
  <div class="u-flex u-flex-col u-gap-md">
    <form-section heading="A5E.ExpertiseDie">
      <update-wrapper
        :document="actor"
        :updatePath="`data.abilities.${ability}.check.expertiseDice`"
        v-slot="slotProps"
      >
        <radio-group
          listClasses="a5e-radio-group--expertise u-gap-md u-mb-md u-text-sm"
          optionClasses="u-p-md u-text-center u-w-12"
          :options="expertiseDiceOptions"
          :selected="data.data.abilities[ability].check.expertiseDice"
          :selectionHandler="slotProps.selectionHandler"
        />
      </update-wrapper>
    </form-section>

    <form-section
      :heading="checkBonusHeading"
      hint="This field accepts any values valid in roll formulae."
    >
      <div class="u-w-full">
        <input
          class="a5e-input"
          type="text"
          :name="`data.abilities.${ability}.check.bonus`"
          :value="data.data.abilities[ability].check.bonus"
        />
      </div>
    </form-section>

    <form-section
      heading="A5E.AbilityCheckBonusGlobal"
      hint="This bonus is added to all ability check modifiers, including skill modifiers. This field accepts any values valid in roll formulae."
    >
      <div class="u-w-full">
        <input
          class="a5e-input"
          type="text"
          name="data.bonuses.abilities.check"
          :value="data.data.bonuses.abilities.check"
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
import UpdateWrapper from "../../forms/UpdateWrapper.vue";

export default {
  components: { FormSection, RadioGroup, UpdateWrapper },
  setup() {
    const ability = inject("ability");
    const actor = inject("actor");
    const data = inject("data");

    const expertiseDiceOptions = prepareExpertiseDiceOptions();

    return {
      ability,
      actor,
      checkBonusHeading: game.i18n.format("A5E.AbilityCheckBonus", {
        ability: game.i18n.localize(CONFIG.A5E.abilities[ability]),
      }),
      data,
      expertiseDiceOptions,
    };
  },
};
</script>
