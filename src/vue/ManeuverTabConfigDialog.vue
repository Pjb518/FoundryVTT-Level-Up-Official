<template>
  <form @submit.prevent="onSubmit" class="a5e-form a5e-form--reactive-dialog">
    <div class="a5e-form__section a5e-form__section--inline">
      <label class="a5e-form__input-label a5e-form__input-label--inline">
        {{ exertionRecoveryLabel }}
      </label>

      <div class="a5e-input-container a5e-input-container--inline-wide">
        <input type="checkbox" v-model="recoverExertionOnRest" />
      </div>
    </div>

    <button class="a5e-button" type="submit">
      <i class="fas fa-save"></i> {{ submitText }}
    </button>
  </form>
</template>

<script>
import NumericField from "./partials/NumericField.vue";
import TagGroup from "./partials/TagGroup.vue";

import { ref } from "vue";

export default {
  components: { NumericField, TagGroup },
  setup(_, context) {
    const { actor, appWindow } = context.attrs;

    const recoverExertionOnRest = ref(
      actor.data.data.attributes.exertion.recoverOnRest
    );

    async function onSubmit() {
      actor.update({
        "data.attributes.exertion.recoverOnRest": recoverExertionOnRest.value,
      });

      appWindow.submit();
    }

    return {
      onSubmit,
      exertionRecoveryLabel: game.i18n.localize(
        "A5E.ExertionRecoveryConfigPrompt"
      ),
      recoverExertionOnRest,
      submitText: game.i18n.localize("A5E.SaveSubmit"),
    };
  },
};
</script>
