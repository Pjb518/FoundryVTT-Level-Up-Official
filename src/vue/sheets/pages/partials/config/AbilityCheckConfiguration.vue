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
        <update-wrapper
          :document="item"
          updatePath="data.check.ability"
          v-slot="slotProps"
        >
          <radio-group
            :options="Object.entries(config.abilities)"
            :selected="data.data.check.ability"
            :selectionHandler="slotProps.selectionHandler"
          />
        </update-wrapper>
      </form-section>
    </div>
  </section>
</template>

<script>
import { inject } from "vue";

import FormSection from "../../../../forms/FormSection.vue";
import RadioGroup from "../../../../forms/RadioGroup.vue";
import UpdateWrapper from "../../../../forms/UpdateWrapper.vue";

export default {
  components: { FormSection, RadioGroup, UpdateWrapper },
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
