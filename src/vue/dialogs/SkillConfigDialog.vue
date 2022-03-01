<template>
  <div class="u-flex u-flex-col u-gap-md u-p-lg">
    <form-section>
      <div class="u-align-center u-flex u-gap-md">
        <input
          class="u-pointer"
          type="checkbox"
          :name="`data.skills.${skill}.proficient`"
          :id="`${appId}-${skill}-proficient`"
          :checked="data.data.skills[skill].proficient"
        />

        <label class="u-pointer" :for="`${appId}-${skill}-proficient`">
          {{ localize("A5E.ProficiencyProficient") }}
        </label>
      </div>
    </form-section>

    <form-section>
      <update-wrapper
        :document="actor"
        :updatePath="`data.skills.${skill}.specialties`"
        v-slot="slotProps"
      >
        <custom-tag-group
          heading="A5E.SkillSpecialties"
          :options="Object.entries(config.skillSpecialties[skill])"
          :selected="data.data.skills[skill].specialties"
          :selectionHandler="slotProps.selectionHandler"
        />
      </update-wrapper>
    </form-section>

    <form-section heading="A5E.ExpertiseDie">
      <update-wrapper
        :document="actor"
        :updatePath="`data.skills.${skill}.expertiseDice`"
        v-slot="slotProps"
      >
        <radio-group
          listClasses="a5e-radio-group--expertise u-gap-md u-mb-md u-text-sm"
          optionClasses="u-p-md u-text-center u-w-12"
          :options="expertiseDiceOptions"
          :selected="data.data.skills[skill].expertiseDice"
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
          :name="`data.skills.${skill}.bonuses.check`"
          :value="data.data.skills[skill].bonuses.check"
        />
      </div>
    </form-section>

    <form-section :heading="passiveBonusHeading">
      <div class="u-w-full">
        <input
          class="a5e-input"
          type="number"
          data-dtype="Number"
          :name="`data.skills.${skill}.bonuses.passive`"
          :value="data.data.skills[skill].bonuses.passive"
        />
      </div>
    </form-section>

    <form-section
      heading="A5E.SkillCheckBonusGlobal"
      hint="This bonus is added to all skill modifiers. This field accepts any values valid in roll formulae."
    >
      <div class="u-w-full">
        <input
          class="a5e-input"
          type="text"
          name="data.bonuses.abilities.skill"
          :value="data.data.bonuses.abilities.skill"
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

    <form-section heading="A5E.MinimumD20Roll">
      <div class="u-w-full">
        <div class="u-w-20">
          <input
            class="a5e-input"
            type="number"
            data-dtype="Number"
            :name="`data.skills.${skill}.minRoll`"
            :value="data.data.skills[skill].minRoll"
          />
        </div>
      </div>
    </form-section>
  </div>
</template>

<script>
import { provide, ref } from "vue";

import prepareExpertiseDiceOptions from "../utils/dataPreparationHelpers/prepareExpertiseDiceOptions";
import registerDialogListeners from "../utils/hookHelpers/registerDialogListeners";

import CustomTagGroup from "../forms/CustomTagGroup.vue";
import FormSection from "../forms/FormSection.vue";
import RadioGroup from "../forms/RadioGroup.vue";
import UpdateWrapper from "../forms/UpdateWrapper.vue";

export default {
  inheritAttrs: false,
  components: { CustomTagGroup, FormSection, RadioGroup, UpdateWrapper },
  setup(_, context) {
    const { actor, skill, appWindow } = context.attrs;
    const appId = appWindow.id;
    const data = ref(actor.sheet.getData());

    const expertiseDiceOptions = prepareExpertiseDiceOptions();

    provide("skill", skill);
    provide("actor", actor);
    provide("data", data);
    provide("dialog", appWindow);

    function updateStoredActorData() {
      data.value = actor.sheet.getData();
    }

    registerDialogListeners({
      appId,
      documentId: actor.id,
      hooks: ["updateActor"],
      updateFunction: updateStoredActorData,
    });

    return {
      actor,
      appId,
      checkBonusHeading: game.i18n.format("A5E.SkillCheckBonus", {
        skill: game.i18n.localize(CONFIG.A5E.skills[skill]),
      }),
      config: CONFIG.A5E,
      data,
      expertiseDiceOptions,
      localize: (key) => game.i18n.localize(key),
      passiveBonusHeading: game.i18n.format("A5E.SkillCheckBonusPassive", {
        skill: game.i18n.localize(CONFIG.A5E.skills[skill]),
      }),
      skill,
    };
  },
};
</script>
