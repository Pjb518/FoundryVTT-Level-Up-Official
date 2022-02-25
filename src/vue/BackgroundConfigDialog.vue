<template>
  <form
    @submit.prevent="onSubmit"
    class="a5e-form u-py-lg u-px-xl a5e-form--reactive-dialog"
  >
    <input-field
      heading="A5E.Background"
      :initialValue="background"
      :inline="true"
      @update-field-value="updateBackground"
    />

    <button class="a5e-button" type="submit">
      <i class="fas fa-save"></i> {{ submitText }}
    </button>
  </form>
</template>

<script>
import InputField from "./partials/InputField.vue";

import { ref } from "vue";

export default {
  components: { InputField },
  setup(_, context) {
    const { actor, appWindow } = context.attrs;
    const background = ref(actor.data.data.details.background);

    function updateBackground(value) {
      background.value = value;
    }

    function onSubmit() {
      actor.update({ "data.details.background": background.value });
      appWindow.submit();
    }

    return {
      background,
      updateBackground,
      onSubmit,
      submitText: game.i18n.localize("A5E.SaveSubmit"),
    };
  },
};
</script>
