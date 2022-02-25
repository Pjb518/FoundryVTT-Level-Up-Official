<template>
  <form
    @submit.prevent="onSubmit"
    class="a5e-form u-py-lg u-px-xl a5e-form--reactive-dialog"
  >
    <select-box
      heading="A5E.SizeCategory"
      :initialValue="size"
      :inline="true"
      :values="sizeCategories"
      @update-selection="updateSizeCategory"
    />

    <button class="a5e-button" type="submit">
      <i class="fas fa-dice-d20"></i> {{ submitText }}
    </button>
  </form>
</template>

<script>
import SelectBox from "./partials/SelectBox.vue";

import { ref } from "vue";

export default {
  components: { SelectBox },
  setup(_, context) {
    const { actor, appWindow } = context.attrs;

    const sizeCategories = CONFIG.A5E.actorSizes;
    const size = ref(actor.data.data.traits.size);

    function updateSizeCategory(value) {
      size.value = value;
    }

    function onSubmit() {
      actor.update({ "data.traits.size": size.value });
      appWindow.submit();
    }

    return {
      onSubmit,
      size,
      sizeCategories,
      submitText: game.i18n.localize("A5E.SaveSubmit"),
      updateSizeCategory,
    };
  },
};
</script>
