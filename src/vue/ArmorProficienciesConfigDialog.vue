<template>
  <form @submit.prevent="onSubmit" class="a5e-form a5e-form--reactive-dialog">
    <tag-group
      heading="A5E.ArmorProficiencies"
      :initialSelections="armorProficiencies"
      :tags="armorTypes"
      :sort="false"
      @updateSelectionList="updateArmorProficiencies"
    />

    <button class="a5e-button" type="submit">
      <i class="fas fa-save"></i> {{ submitText }}
    </button>
  </form>
</template>

<script>
import TagGroup from "./partials/TagGroup.vue";

import { ref } from "vue";

export default {
  components: { TagGroup },
  setup(_, context) {
    const { actor, appWindow } = context.attrs;
    const actorData = actor.data.data;

    const armorTypes = CONFIG.A5E.armorPlural;
    const armorProficiencies = ref(actorData.proficiencies.armor);

    function updateArmorProficiencies(value) {
      armorProficiencies.value = value;
    }

    function onSubmit() {
      actor.update({
        "data.proficiencies.armor": armorProficiencies.value,
      });

      appWindow.submit();
    }

    return {
      armorTypes,
      armorProficiencies,
      onSubmit,
      updateArmorProficiencies,
      submitText: game.i18n.localize("A5E.SaveSubmit"),
    };
  },
};
</script>
