<template>
  <div class="u-p-lg">
    <form-section heading="A5E.ArmorProficiencies">
      <update-wrapper
        :document="actor"
        updatePath="data.proficiencies.armor"
        v-slot="slotProps"
      >
        <checkbox-group
          :options="Object.entries(config.armorPlural)"
          :selected="data.data.proficiencies.armor"
          :selectionHandler="slotProps.selectionHandler"
        />
      </update-wrapper>
    </form-section>
  </div>
</template>

<script>
import { ref, provide } from "vue";

import registerDialogListeners from "../utils/hookHelpers/registerDialogListeners";

import CheckboxGroup from "../forms/CheckboxGroup.vue";
import FormSection from "../forms/FormSection.vue";
import UpdateWrapper from "../forms/UpdateWrapper.vue";

export default {
  components: { CheckboxGroup, FormSection, UpdateWrapper },
  setup(_, context) {
    const { actor, appWindow } = context.attrs;
    const appId = appWindow.id;
    const data = ref(actor.sheet.getData());

    function updateStoredActorData() {
      data.value = actor.sheet.getData();
    }

    provide("data", data);

    registerDialogListeners({
      appId,
      documentId: actor.id,
      hooks: ["updateActor"],
      updateFunction: updateStoredActorData,
    });

    return {
      actor,
      data,
      config: CONFIG.A5E,
    };
  },
};
</script>
