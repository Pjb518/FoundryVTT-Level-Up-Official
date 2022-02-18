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
      @click="editModeActive = !editModeActive"
    >
      <h3>Feature Properties</h3>
      <i
        class="u-text-sm fas"
        :class="editModeActive ? 'fa-chevron-up' : 'fa-edit'"
      ></i>
    </header>

    <div v-if="editModeActive" class="u-flex u-flex-col u-gap-md">
      <form-section heading="A5E.FeatureTypePrompt">
        <radio-group
          :document="item"
          :options="Object.entries(config.featureTypes)"
          updatePath="data.featureType"
        />
      </form-section>
    </div>

    <dl
      v-else
      class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm"
    >
      <div class="u-flex u-gap-md">
        <dt class="u-text-bold">{{ localize("A5E.FeatureTypePrompt") }}:</dt>
        <dd class="u-m-0 u-p-0">
          {{
            localize(config.featureTypes[data.data.featureType] ?? "A5E.None")
          }}
        </dd>
      </div>
    </dl>
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

    const editModeActive = ref(false);

    return {
      appId,
      config: CONFIG.A5E,
      data,
      editModeActive,
      item,
      localize: (key) => game.i18n.localize(key),
    };
  },
};
</script>
