<template>
  <form @submit.prevent="onSubmit" class="a5e-form a5e-form--reactive-dialog">
    <tag-group
      heading="A5E.Languages"
      :initialSelections="knownCoreLanguages"
      :tags="languages"
      @updateSelectionList="updateKnownCoreLanguages"
    />

    <input-field
      :hasInitialFocus="true"
      hint="A5E.HintSeparateBySemiColon"
      :initialValue="knownCustomLanguages"
      @update-field-value="updateKnownCustomLanguages"
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
    const languages = CONFIG.A5E.languages;

    const languageProficiencies = actorData.proficiencies.languages.reduce(
      (acc, curr) => {
        if (Object.keys(languages).includes(curr)) acc.core.push(curr);
        else acc.custom.push(curr);
        return acc;
      },
      { core: [], custom: [] }
    );

    const knownCoreLanguages = ref(languageProficiencies.core);
    const knownCustomLanguages = ref(languageProficiencies.custom.join("; "));

    function updateKnownCoreLanguages(value) {
      knownCoreLanguages.value = value;
    }

    function updateKnownCustomLanguages(value) {
      knownCustomLanguages.value = value;
    }

    function onSubmit() {
      const knownLanguages = [
        ...knownCoreLanguages.value,
        ...knownCustomLanguages.value
          .split(";")
          .map((tool) => tool.trim())
          .filter(Boolean),
      ];

      actor.update({ "data.proficiencies.languages": knownLanguages });
      appWindow.submit();
    }

    return {
      languages,
      knownCoreLanguages,
      knownCustomLanguages,
      onSubmit,
      updateKnownCoreLanguages,
      updateKnownCustomLanguages,
      submitText: game.i18n.localize("A5E.SaveSubmit"),
    };
  },
};
</script>
