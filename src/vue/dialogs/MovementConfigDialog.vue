<template>
  <div class="u-flex u-flex-col u-gap-md u-p-lg">
    <form-section
      v-for="[movementMode, distance] in Object.entries(
        data.data.attributes.movement
      )"
      :key="movementMode"
      :heading="headings[movementMode]"
      :inline="true"
    >
      <div class="u-w-20">
        <input
          class="a5e-input"
          type="text"
          :name="`data.attributes.movement.${movementMode}`"
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
      burrow: "A5E.MovementBurrowingSpeed",
      climb: "A5E.MovementClimbingSpeed",
      fly: "A5E.MovementFlyingSpeed",
      swim: "A5E.MovementSwimmingSpeed",
      walk: "A5E.MovementWalkingSpeed",
    };

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
      config: CONFIG.A5E,
      data,
      headings,
    };
  },
};
</script>
