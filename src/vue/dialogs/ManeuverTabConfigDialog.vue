<template>
  <div class="u-flex u-flex-col u-gap-md u-p-lg">
    <form-section heading="A5E.ManeuverDCBonus">
      <div class="u-w-full">
        <div class="u-w-20">
          <input
            class="a5e-input"
            type="text"
            name="data.bonuses.maneuverDC"
            :value="data.data.bonuses.maneuverDC"
          />
        </div>
      </div>
    </form-section>

    <form-section>
      <div class="u-align-center u-flex u-gap-md">
        <input
          class="u-pointer"
          type="checkbox"
          name="data.attributes.exertion.recoverOnRest"
          :id="`${appId}-exertion-recovery`"
          :checked="data.data.attributes.exertion.recoverOnRest"
        />

        <label class="u-pointer" :for="`${appId}-exertion-recovery`">
          {{ localize("A5E.ExertionRecoveryConfigPrompt") }}
        </label>
      </div>
    </form-section>
  </div>
</template>

<script>
import { ref } from "vue";

import registerDialogListeners from "../utils/hookHelpers/registerDialogListeners";

import FormSection from "../forms/FormSection.vue";

export default {
  components: { FormSection },
  setup(_, context) {
    const { actor, appWindow } = context.attrs;
    const appId = appWindow.id;
    const data = ref(actor.sheet.getData());

    function updateStoredActorData() {
      data.value = actor.sheet.getData();
    }

    registerDialogListeners(
      appId,
      actor,
      ["updateActor"],
      updateStoredActorData
    );

    return {
      appId,
      actor,
      data,
      localize: (key) => game.i18n.localize(key),
    };
  },
};
</script>
