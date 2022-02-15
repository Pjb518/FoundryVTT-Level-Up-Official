<template>
  <section>
    <header
      class="
        u-align-center
        u-flex
        u-font-serif
        u-gap-md
        u-mb-lg
        u-ml-xs
        u-pointer
        u-text-lg
        u-w-fit
      "
    >
      <h3>Ability Check Button Configuration</h3>
    </header>

    <div class="u-flex u-flex-col u-gap-md">
      <form-section
        heading="A5E.AbilityScore"
        hint="Select the ability score to use for the check."
      >
        <radio-group
          :document="item"
          :options="Object.entries(config.abilities)"
          updatePath="data.check.ability"
        />
      </form-section>
    </div>
  </section>
</template>

<script>
import { inject, ref } from "vue";

import FormSection from "../../../forms/FormSection.vue";
import RadioGroup from "../../../forms/RadioGroup.vue";

export default {
  components: { FormSection, RadioGroup },
  setup() {
    const appId = inject("appId");
    const data = inject("data");
    const item = inject("item");

    return {
      appId,
      config: CONFIG.A5E,
      data,
      item,
      localize: (key) => game.i18n.localize(key),
    };
  },
};
</script>
