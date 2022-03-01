<template>
  <div class="u-p-lg">
    <form-section>
      <update-wrapper
        :document="actor"
        updatePath="data.proficiencies.languages"
        v-slot="slotProps"
      >
        <custom-tag-group
          heading="A5E.Languages"
          :options="Object.entries(config.languages)"
          :selected="data.data.proficiencies.languages"
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
