<template>
  <form
    @submit.prevent="onSubmit"
    class="a5e-form u-py-lg u-px-xl a5e-form--reactive-dialog"
  >
    <tag-group
      heading="A5E.ConditionImmunities"
      :initialSelections="selectedCoreConditions"
      :tags="conditions"
      @updateSelectionList="updateSelectedCoreConditions"
    />

    <input-field
      :hasInitialFocus="true"
      hint="A5E.HintSeparateBySemiColon"
      :initialValue="selectedCustomConditions"
      @update-field-value="updateSelectedCustomConditions"
    />

    <button class="a5e-button" type="submit">
      <i class="fas fa-save"></i> {{ submitText }}
    </button>
  </form>
</template>

<script>
import InputField from "./partials/InputField.vue";
import TagGroup from "./partials/TagGroup.vue";

import { ref } from "vue";

export default {
  components: { InputField, TagGroup },
  setup(_, context) {
    const { actor, appWindow, updatePath } = context.attrs;
    const actorData = actor.data.data;

    const { conditions } = CONFIG.A5E;

    const selectedConditions = actorData.traits.conditionImmunities.reduce(
      (acc, curr) => {
        if (Object.keys(conditions).includes(curr)) {
          acc.core.push(curr);
        } else {
          acc.custom.push(curr);
        }

        return acc;
      },
      { core: [], custom: [] }
    );

    const selectedCoreConditions = ref(selectedConditions.core);
    const selectedCustomConditions = ref(selectedConditions.custom.join("; "));

    function updateSelectedCoreConditions(value) {
      selectedCoreConditions.value = value;
    }

    function updateSelectedCustomConditions(value) {
      selectedCustomConditions.value = value;
    }

    function onSubmit() {
      actor.update({
        "data.traits.conditionImmunities": [
          ...selectedCoreConditions.value,
          ...selectedCustomConditions.value
            .split(";")
            .map((condition) => condition.trim())
            .filter(Boolean),
        ],
      });

      appWindow.submit();
    }

    return {
      conditions,
      selectedCoreConditions,
      selectedCustomConditions,
      updateSelectedCoreConditions,
      updateSelectedCustomConditions,
      onSubmit,
      submitText: game.i18n.localize("A5E.SaveSubmit"),
    };
  },
};
</script>
