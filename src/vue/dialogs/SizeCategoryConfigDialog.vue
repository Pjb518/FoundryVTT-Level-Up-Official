<template>
  <div class="u-p-lg">
    <form-section heading="A5E.SizeCategory" :inline="true">
      <div class="u-flex u-flex-col u-w-fit">
        <select class="u-h-8 u-w-fit" name="data.traits.size">
          <option value=""></option>

          <option
            v-for="[key, name] in Object.entries(config.actorSizes)"
            :key="key"
            :value="key"
            :selected="data.data.traits.size === key"
          >
            {{ localize(name) }}
          </option>
        </select>
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
      data,
      config: CONFIG.A5E,
      localize: (key) => game.i18n.localize(key),
    };
  },
};
</script>
