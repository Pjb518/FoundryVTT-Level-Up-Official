<template>
  <form @submit.prevent="onSubmit" class="a5e-form a5e-form--reactive-dialog">
    <ability-score-picker
      :appId="appId"
      heading="A5E.SpellcastinAbilityScore"
      :initialSelection="spellcastingAbility"
      :showNone="false"
      @update-selected-ability="updateSelectedAbility"
    />

    <tag-group
      heading="A5E.AvailableSpellLevels"
      :initialSelections="initiallySelectedSpellLevels"
      :tags="spellLevels"
      @updateSelectionList="updateAvailableSpellLevels"
    />

    <div class="a5e-form__section a5e-form__section--inline">
      <label class="u-text-bold u-text-sm u-flex-shrink-0 u-mb-0">
        {{ spellSlotsLabel }}
      </label>

      <div class="a5e-input-container a5e-input-container--inline-wide">
        <input type="checkbox" v-model="showSpellSlots" />
      </div>
    </div>

    <div class="a5e-form__section a5e-form__section--inline">
      <label class="u-text-bold u-text-sm u-flex-shrink-0 u-mb-0">
        {{ spellPointsLabel }}
      </label>

      <div class="a5e-input-container a5e-input-container--inline-wide">
        <input type="checkbox" v-model="showSpellPoints" />
      </div>
    </div>

    <button class="a5e-button" type="submit">
      <i class="fas fa-save"></i> {{ submitText }}
    </button>
  </form>
</template>

<script>
import AbilityScorePicker from "./partials/AbilityScorePicker.vue";
import NumericField from "./partials/NumericField.vue";
import TagGroup from "./partials/TagGroup.vue";

import { ref } from "vue";

export default {
  components: { AbilityScorePicker, NumericField, TagGroup },
  setup(_, context) {
    const { actor, appWindow } = context.attrs;
    const appId = appWindow.id;

    const spellcastingAbility = ref(actor.data.data.attributes.spellcasting);
    const showSpellSlots = ref(actor.getFlag("a5e", "showSpellSlots") ?? true);

    const showSpellPoints = ref(
      actor.getFlag("a5e", "showSpellPoints") ?? true
    );

    const availableSpellLevels = ref(
      actor.getFlag("a5e", "availableSpellLevels") ||
        [...Array(10).keys()].map((x) => x.toString())
    );

    function updateAvailableSpellLevels(value) {
      availableSpellLevels.value = value;
    }

    function updateSelectedAbility(ability) {
      spellcastingAbility.value = ability;
    }

    async function onSubmit() {
      const data = {
        "data.attributes.spellcasting": spellcastingAbility.value,
      };

      await actor.setFlag(
        "a5e",
        "availableSpellLevels",
        availableSpellLevels.value
      );

      await actor.setFlag("a5e", "showSpellPoints", showSpellPoints.value);
      await actor.setFlag("a5e", "showSpellSlots", showSpellSlots.value);
      await actor.update(data);

      appWindow.submit();
    }

    return {
      appId,
      initiallySelectedSpellLevels:
        actor.getFlag("a5e", "availableSpellLevels") ||
        [...Array(10).keys()].map((x) => x.toString()),
      onSubmit,
      showSpellPoints,
      showSpellSlots,
      spellcastingAbility,
      spellLevels: CONFIG.A5E.spellLevels,
      spellSlotsLabel: game.i18n.localize("A5E.SpellShowSpellSlots"),
      spellPointsLabel: game.i18n.localize("A5E.SpellShowSpellPoints"),
      submitText: game.i18n.localize("A5E.SaveSubmit"),
      updateAvailableSpellLevels,
      updateSelectedAbility,
    };
  },
};
</script>
