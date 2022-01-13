<template>
  <form @submit.prevent="onSubmit" class="a5e-form a5e-form--reactive-dialog">
    <input-field
      heading="A5E.Culture"
      :initialValue="culture"
      :inline="true"
      @update-field-value="updateCulture"
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
    const culture = ref(actor.data.data.details.culture);

    function updateCulture(value) {
      culture.value = value;
    }

    function onSubmit() {
      actor.update({ "data.details.culture": culture.value });
      appWindow.submit();
    }

    return {
      culture,
      updateCulture,
      onSubmit,
      submitText: game.i18n.localize("A5E.SaveSubmit"),
    };
  },
};
</script>
