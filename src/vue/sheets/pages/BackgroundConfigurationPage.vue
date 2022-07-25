<template>
  <div class="u-flex u-flex-col u-gap-md">
    <form-section>
      <div class="u-align-center u-flex u-gap-md u-w-full">
        <input
          class="u-pointer"
          type="checkbox"
          :name="`data.includesASI`"
          :id="`${appId}-includesASI`"
          :checked="data.data.includesASI"
        />

        <label class="u-pointer" :for="`${appId}-includesASI`">
          {{ localize("A5E.BackgroundIncludesASI") }}
        </label>
      </div>
    </form-section>

    <form-section
      v-if="data.data.includesASI"
      heading="A5E.BackgroundDefaultASI"
      hint="Select the specific ability score bonus for this background."
    >
      <update-wrapper
        :document="item"
        updatePath="data.defaultASI"
        v-slot="slotProps"
      >
        <radio-group
          :options="Object.entries(config.abilities)"
          :selected="data.data.defaultASI"
          :selectionHandler="slotProps.selectionHandler"
        />
      </update-wrapper>
    </form-section>
  </div>
</template>

<script>
import { inject } from "vue";

import FormSection from "../../forms/FormSection.vue";
import RadioGroup from "../../forms/RadioGroup.vue";
import UpdateWrapper from "../../forms/UpdateWrapper.vue";

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
