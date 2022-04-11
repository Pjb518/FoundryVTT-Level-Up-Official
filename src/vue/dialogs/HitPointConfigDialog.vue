<template>
  <div class="u-flex u-flex-col u-gap-md u-p-lg">
    <form-section
      v-for="{ label, updateAttribute } in hpFields"
      :key="`${appId}-${updateAttribute}`"
      :heading="label"
      :inline="true"
    >
      <div class="u-w-20">
        <input
          class="a5e-input"
          type="number"
          data-dtype="Number"
          :name="`data.attributes.hp.${updateAttribute}`"
          :value="data.data.attributes.hp[updateAttribute]"
        />
      </div>
    </form-section>

    <hr class="a5e-rule a5e-rule--form u-my-sm" />

    <section
      class="u-mt-0"
      :class="{
        'u-grid u-grid-3 u-gap-lg': actorType === 'npc',
        'u-flex u-gap-md': actorType === 'character',
      }"
    >
      <div class="a5e-hit-die-wrapper" v-for="die in hitDice" :key="die">
        <hit-die-config
          :dieSize="die"
          :current="data.data.attributes.hitDice[die].current"
          :total="data.data.attributes.hitDice[die].total"
        />
      </div>
    </section>
  </div>
</template>

<script>
import { provide, ref } from "vue";

import registerDialogListeners from "../utils/hookHelpers/registerDialogListeners";

import FormSection from "../forms/FormSection.vue";
import HitDieConfig from "./partials/HitDieConfig.vue";

export default {
  components: { FormSection, HitDieConfig },
  setup(_, context) {
    const { actor, appWindow } = context.attrs;
    const appId = appWindow.id;
    const data = ref(actor.sheet.getData());

    const hpFields = [
      { label: "A5E.HitPointsCurrent", updateAttribute: "value" },
      { label: "A5E.HitPointsBaseMaximum", updateAttribute: "baseMax" },
      { label: "A5E.HitPointsTemporary", updateAttribute: "temp" },
      { label: "A5E.HitPointsMaxModifier", updateAttribute: "bonus" },
    ];

    const hitDice = ["d6", "d8", "d10", "d12"];

    if (actor.type === "npc") {
      hitDice.unshift("d4");
      hitDice.push("d20");
    }

    provide("data", data);

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
      actorType: actor.type,
      appId,
      config: CONFIG.A5E,
      data,
      hitDice,
      hpFields,
    };
  },
};
</script>
