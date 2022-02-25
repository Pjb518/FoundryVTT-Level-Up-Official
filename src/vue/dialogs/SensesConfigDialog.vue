<template>
  <div class="u-flex u-flex-col u-gap-md u-p-lg">
    <form-section
      v-for="[sense, distance] in Object.entries(data.data.attributes.senses)"
      :key="sense"
      :heading="headings[sense]"
      :inline="true"
    >
      <div class="u-w-20">
        <input
          class="a5e-input"
          type="text"
          :name="`data.attributes.senses.${sense}`"
          :value="distance || ''"
        />
      </div>
    </form-section>
  </div>
</template>

<script>
import { provide, ref } from "vue";

import registerDialogListeners from "../utils/hookHelpers/registerDialogListeners";

import FormSection from "../forms/FormSection.vue";

export default {
  components: { FormSection },
  setup(_, context) {
    const { actor, appWindow } = context.attrs;
    const appId = appWindow.id;
    const data = ref(actor.sheet.getData());

    const headings = {
      blindsight: "A5E.SenseBlindsightRange",
      darkvision: "A5E.SenseDarkvisionRange",
      tremorsense: "A5E.SenseTremorsenseRange",
      truesight: "A5E.SenseTruesightRange",
    };

    function updateStoredActorData() {
      data.value = actor.sheet.getData();
    }

    provide("data", data);

    registerDialogListeners(appId, ["updateActor"], updateStoredActorData);

    return {
      config: CONFIG.A5E,
      data,
      headings,
    };
  },
};
</script>
