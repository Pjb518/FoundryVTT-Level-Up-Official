<template>
  <div class="u-p-lg">
    <form-section heading="A5E.ArmorProficiencies">
      <checkbox-group
        :document="actor"
        :options="Object.entries(config.armorPlural)"
        updatePath="data.proficiencies.armor"
      />
    </form-section>
  </div>
</template>

<script>
import { ref, provide } from "vue";

import registerDialogListeners from "../utils/hookHelpers/registerDialogListeners";

import CheckboxGroup from "../forms/CheckboxGroup.vue";
import FormSection from "../forms/FormSection.vue";

export default {
  components: { CheckboxGroup, FormSection },
  setup(_, context) {
    const { actor, appWindow } = context.attrs;
    const appId = appWindow.id;
    const data = ref(actor.sheet.getData());

    function updateStoredActorData() {
      data.value = actor.sheet.getData();
    }

    provide("data", data);

    registerDialogListeners(appId, ["updateActor"], updateStoredActorData);

    return {
      actor,
      config: CONFIG.A5E,
    };
  },
};
</script>
