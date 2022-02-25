<template>
  <div class="u-flex u-flex-col u-gap-md u-p-lg">
    <form-section heading="A5E.ExpertiseDie">
      <radio-group
        listClasses="a5e-radio-group--expertise u-gap-md u-mb-md u-text-sm"
        optionClasses="u-p-md u-text-center u-w-12"
        :document="actor"
        :options="expertiseDiceOptions"
        updatePath="data.attributes.initiative.expertiseDice"
      />
    </form-section>

    <form-section
      heading="A5E.InitiativeBonus"
      hint="This field accepts any values valid in roll formulae."
    >
      <div class="u-w-full">
        <input
          class="a5e-input"
          type="text"
          name="data.attributes.initiative.bonus"
          :value="data.data.attributes.initiative.bonus"
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
import { provide, ref } from "vue";

import prepareExpertiseDiceOptions from "../utils/dataPreparationHelpers/prepareExpertiseDiceOptions";
import registerDialogListeners from "../utils/hookHelpers/registerDialogListeners";

import FormSection from "../forms/FormSection.vue";
import RadioGroup from "../forms/RadioGroup.vue";

export default {
  components: { FormSection, RadioGroup },
  setup(_, context) {
    const { actor, appWindow } = context.attrs;
    const appId = appWindow.id;
    const data = ref(actor.sheet.getData());

    const expertiseDiceOptions = prepareExpertiseDiceOptions();

    function updateStoredActorData() {
      data.value = actor.sheet.getData();
    }

    provide("actor", actor);
    provide("data", data);
    provide("dialog", appWindow);

    registerDialogListeners(appId, ["updateActor"], updateStoredActorData);

    return {
      actor,
      data,
      expertiseDiceOptions,
    };
  },
};
</script>
