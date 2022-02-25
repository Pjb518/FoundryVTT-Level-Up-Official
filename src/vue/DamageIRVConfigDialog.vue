<template>
  <form
    @submit.prevent="onSubmit"
    class="a5e-form u-py-lg u-px-xl a5e-form--reactive-dialog"
  >
    <tag-group
      heading="A5E.DamageTypePlural"
      :initialSelections="selectedCoreDamageTypes"
      :tags="damageTypes"
      @updateSelectionList="updateSelectedCoreDamageTypes"
    />

    <input-field
      :hasInitialFocus="true"
      hint="A5E.HintSeparateBySemiColon"
      :initialValue="selectedCustomDamageTypes"
      @update-field-value="updateSelectedCustomDamageTypes"
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

    const damageTypes = CONFIG.A5E.damageTypes;

    const selectedDamageTypes = actorData.traits[updatePath].reduce(
      (acc, curr) => {
        if (Object.keys(damageTypes).includes(curr)) {
          acc.core.push(curr);
        } else {
          acc.custom.push(curr);
        }

        return acc;
      },
      { core: [], custom: [] }
    );

    const selectedCoreDamageTypes = ref(selectedDamageTypes.core);

    const selectedCustomDamageTypes = ref(
      selectedDamageTypes.custom.join("; ")
    );

    function updateSelectedCoreDamageTypes(value) {
      selectedCoreDamageTypes.value = value;
    }

    function updateSelectedCustomDamageTypes(value) {
      selectedCustomDamageTypes.value = value;
    }

    function onSubmit() {
      const updates = {};

      updates[`data.traits.${updatePath}`] = [
        ...selectedCoreDamageTypes.value,
        ...selectedCustomDamageTypes.value
          .split(";")
          .map((damageType) => damageType.trim())
          .filter(Boolean),
      ];

      actor.update(updates);
      appWindow.submit();
    }

    return {
      damageTypes,
      selectedCoreDamageTypes,
      selectedCustomDamageTypes,
      updateSelectedCoreDamageTypes,
      updateSelectedCustomDamageTypes,
      onSubmit,
      submitText: game.i18n.localize("A5E.SaveSubmit"),
    };
  },
};
</script>
