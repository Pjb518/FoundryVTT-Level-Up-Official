<template>
  <div class="u-flex u-flex-col u-gap-md u-p-lg">
    <form-section>
      <update-wrapper
        :document="actor"
        updatePath="flags.a5e.availableSpellLevels"
        v-slot="slotProps"
      >
        <custom-tag-group
          heading="A5E.AvailableSpellLevels"
          :options="Object.entries(config.spellLevels)"
          :selected="
            data.flags.a5e?.availableSpellLevels ||
            [...Array(10).keys()].map((x) => x.toString())
          "
          :selectionHandler="slotProps.selectionHandler"
          :showCustomInput="false"
        />
      </update-wrapper>
    </form-section>

    <form-section heading="A5E.SpellcastingAbilityScore">
      <update-wrapper
        :document="actor"
        updatePath="data.attributes.spellcasting"
        v-slot="slotProps"
      >
        <radio-group
          listClasses="a5e-radio-group--expertise u-gap-md u-mb-md u-text-sm"
          optionClasses="u-p-md u-text-center u-w-12"
          :options="Object.entries(config.abilityAbbreviations)"
          :selected="data.data.attributes.spellcasting"
          :selectionHandler="slotProps.selectionHandler"
        />
      </update-wrapper>
    </form-section>

    <form-section heading="A5E.SpellDCBonus">
      <div class="u-w-full">
        <div class="u-w-20">
          <input
            class="a5e-input"
            type="text"
            name="data.bonuses.spell.dc"
            :value="data.data.bonuses.spell.dc"
          />
        </div>
      </div>
    </form-section>

    <form-section>
      <div class="u-align-center u-flex u-gap-xxl">
        <div class="u-align-center u-flex u-gap-md">
          <input
            class="u-pointer"
            type="checkbox"
            name="flags.a5e.showSpellSlots"
            :id="`${appId}-show-spell-slots`"
            :checked="data.flags.a5e.showSpellSlots"
          />

          <label class="u-pointer" :for="`${appId}-show-spell-slots`">
            {{ localize("A5E.SpellShowSpellSlots") }}
          </label>
        </div>

        <div class="u-align-center u-flex u-gap-md">
          <input
            class="u-pointer"
            type="checkbox"
            name="flags.a5e.showSpellPoints"
            :id="`${appId}-show-spell-points`"
            :checked="data.flags.a5e.showSpellPoints"
          />

          <label class="u-pointer" :for="`${appId}-show-spell-points`">
            {{ localize("A5E.SpellShowSpellPoints") }}
          </label>
        </div>
      </div>
    </form-section>
  </div>
</template>

<script>
import { ref } from "vue";

import registerDialogListeners from "../utils/hookHelpers/registerDialogListeners";

import CustomTagGroup from "../forms/CustomTagGroup.vue";
import FormSection from "../forms/FormSection.vue";
import RadioGroup from "../forms/RadioGroup.vue";
import UpdateWrapper from "../forms/UpdateWrapper.vue";

export default {
  components: { CustomTagGroup, FormSection, RadioGroup, UpdateWrapper },
  setup(_, context) {
    const { actor, appWindow } = context.attrs;
    const appId = appWindow.id;
    const data = ref(actor.sheet.getData());

    function updateStoredActorData() {
      data.value = actor.sheet.getData();
    }

    registerDialogListeners({
      appId,
      documentId: actor.parent ? actor.parent.id : actor.id,
      hooks: [actor.parent ? "updateToken" : "updateActor"],
      updateFunction: updateStoredActorData,
    });

    return {
      appId,
      actor,
      config: CONFIG.A5E,
      data,
      localize: (key) => game.i18n.localize(key),
    };
  },
};
</script>
