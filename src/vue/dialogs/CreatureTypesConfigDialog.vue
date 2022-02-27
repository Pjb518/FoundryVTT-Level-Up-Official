<template>
  <div class="u-p-lg">
    <form-section>
      <update-wrapper
        :document="actor"
        updatePath="data.details.creatureTypes"
        v-slot="slotProps"
      >
        <custom-tag-group
          heading="A5E.CreatureTypePlural"
          :options="Object.entries(config.creatureTypes)"
          :selected="data.data.details.creatureTypes"
          :selectionHandler="slotProps.selectionHandler"
        />
      </update-wrapper>
    </form-section>
  </div>
</template>

<script>
import { ref, provide } from "vue";

import registerDialogListeners from "../utils/hookHelpers/registerDialogListeners";

import CustomTagGroup from "../forms/CustomTagGroup.vue";
import FormSection from "../forms/FormSection.vue";
import UpdateWrapper from "../forms/UpdateWrapper.vue";

export default {
  components: { CustomTagGroup, FormSection, UpdateWrapper },
  setup(_, context) {
    const { actor, appWindow } = context.attrs;
    const appId = appWindow.id;
    const data = ref(actor.sheet.getData());

    function updateStoredActorData() {
      data.value = actor.sheet.getData();
    }

    provide("data", data);

    registerDialogListeners(
      appId,
      actor,
      ["updateActor"],
      updateStoredActorData
    );

    return {
      actor,
      data,
      config: CONFIG.A5E,
    };
  },
};
</script>
