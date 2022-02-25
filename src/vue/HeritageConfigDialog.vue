<template>
  <form
    @submit.prevent="onSubmit"
    class="a5e-form u-py-lg u-px-xl a5e-form--reactive-dialog"
  >
    <input-field
      heading="A5E.Heritage"
      :initialValue="heritage"
      :inline="true"
      @update-field-value="updateHeritage"
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
    const heritage = ref(actor.data.data.details.heritage);

    function updateHeritage(value) {
      heritage.value = value;
    }

    function onSubmit() {
      actor.update({ "data.details.heritage": heritage.value });
      appWindow.submit();
    }

    return {
      heritage,
      updateHeritage,
      onSubmit,
      submitText: game.i18n.localize("A5E.SaveSubmit"),
    };
  },
};
</script>
