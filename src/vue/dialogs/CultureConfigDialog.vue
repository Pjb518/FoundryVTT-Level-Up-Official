<template>
  <div class="u-p-lg">
    <form-section heading="A5E.Culture">
      <div class="u-w-full">
        <input
          class="a5e-input"
          type="text"
          name="data.details.culture"
          :value="data.data.details.culture"
          v-autowidth="{ minWidth: '12.5rem', maxWidth: '100%' }"
        />
      </div>
    </form-section>
  </div>
</template>

<script>
import { ref, provide } from "vue";
import { directive as VueInputAutowidth } from "vue-input-autowidth";

import registerDialogListeners from "../utils/hookHelpers/registerDialogListeners";

import FormSection from "../forms/FormSection.vue";

export default {
  components: { FormSection },
  directives: { autowidth: VueInputAutowidth },
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
      data,
      config: CONFIG.A5E,
    };
  },
};
</script>
