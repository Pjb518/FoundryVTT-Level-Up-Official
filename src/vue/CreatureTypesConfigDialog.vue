<template>
  <form @submit.prevent="onSubmit" class="a5e-form a5e-form--reactive-dialog">
    <tag-group
      heading="A5E.CreatureTypePlural"
      :initialSelections="selectedCoreCreatureTypes"
      :tags="creatureTypes"
      @updateSelectionList="updateSelectedCoreCreatureTypes"
    />

    <input-field
      :hasInitialFocus="true"
      hint="A5E.HintSeparateBySemiColon"
      :initialValue="selectedCustomCreatureTypes"
      @update-field-value="updateSelectedCustomCreatureTypes"
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
    const { actor, appWindow } = context.attrs;
    const actorData = actor.data.data;

    const { creatureTypes } = CONFIG.A5E;

    const selectedCreatureTypes = actorData.details.creatureTypes.reduce(
      (acc, curr) => {
        if (Object.keys(creatureTypes).includes(curr)) {
          acc.core.push(curr);
        } else {
          acc.custom.push(curr);
        }

        return acc;
      },
      { core: [], custom: [] }
    );

    const selectedCoreCreatureTypes = ref(selectedCreatureTypes.core);

    const selectedCustomCreatureTypes = ref(
      selectedCreatureTypes.custom.join("; ")
    );

    function updateSelectedCoreCreatureTypes(value) {
      selectedCoreCreatureTypes.value = value;
    }

    function updateSelectedCustomCreatureTypes(value) {
      selectedCustomCreatureTypes.value = value;
    }

    function onSubmit() {
      actor.update({
        "data.details.creatureTypes": [
          ...selectedCoreCreatureTypes.value,
          ...selectedCustomCreatureTypes.value
            .split(";")
            .map((creatureType) => creatureType.trim())
            .filter(Boolean),
        ],
      });

      appWindow.submit();
    }

    return {
      creatureTypes,
      onSubmit,
      selectedCoreCreatureTypes,
      selectedCustomCreatureTypes,
      submitText: game.i18n.localize("A5E.SaveSubmit"),
      updateSelectedCoreCreatureTypes,
      updateSelectedCustomCreatureTypes,
    };
  },
};
</script>
