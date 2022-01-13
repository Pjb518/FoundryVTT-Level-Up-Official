<template>
  <form @submit.prevent="onSubmit" class="a5e-form a5e-form--reactive-dialog">
    <numeric-field
      heading="A5E.SenseBlindsightRange"
      :initialValue="blindsightRange"
      @update-field-value="updateBlindsightRange"
    />

    <numeric-field
      heading="A5E.SenseDarkvisionRange"
      :initialValue="darkvisionRange"
      @update-field-value="updateDarkvisionRange"
    />

    <numeric-field
      heading="A5E.SenseTremorsenseRange"
      :initialValue="tremorsenseRange"
      @update-field-value="updateTremorsenseRange"
    />

    <numeric-field
      heading="A5E.SenseTruesightRange"
      :initialValue="truesightRange"
      @update-field-value="updateTruesightRange"
    />

    <button class="a5e-button" type="submit">
      <i class="fas fa-save"></i> {{ submitText }}
    </button>
  </form>
</template>

<script>
import NumericField from "./partials/NumericField.vue";

import { ref } from "vue";

export default {
  components: { NumericField },
  setup(_, context) {
    const { actor, appWindow } = context.attrs;
    const senseData = actor.data.data.attributes.senses;

    const blindsightRange = ref(senseData.blindsight);
    const darkvisionRange = ref(senseData.darkvision);
    const tremorsenseRange = ref(senseData.tremorsense);
    const truesightRange = ref(senseData.truesight);

    // TODO: Combine all of these into a single function
    function updateBlindsightRange(value) {
      blindsightRange.value = value;
    }

    function updateDarkvisionRange(value) {
      darkvisionRange.value = value;
    }

    function updateTremorsenseRange(value) {
      tremorsenseRange.value = value;
    }

    function updateTruesightRange(value) {
      truesightRange.value = value;
    }

    function onSubmit() {
      const data = {};
      const basePath = "data.attributes.senses";

      data[`${basePath}.blindsight`] = blindsightRange.value;
      data[`${basePath}.darkvision`] = darkvisionRange.value;
      data[`${basePath}.tremorsense`] = tremorsenseRange.value;
      data[`${basePath}.truesight`] = truesightRange.value;

      actor.update(data);
      appWindow.submit();
    }

    return {
      blindsightRange,
      darkvisionRange,
      tremorsenseRange,
      truesightRange,
      updateBlindsightRange,
      updateDarkvisionRange,
      updateTremorsenseRange,
      updateTruesightRange,
      onSubmit,
      submitText: game.i18n.localize("A5E.SaveSubmit"),
    };
  },
};
</script>
