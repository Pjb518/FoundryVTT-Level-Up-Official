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
      <h3>{{ localize("A5E.MaterialProperties") }}</h3>
      <i
        class="u-text-sm fas"
        :class="editModeActive ? 'fa-chevron-up' : 'fa-edit'"
      ></i>
    </header>

    <div v-if="editModeActive" class="u-flex u-flex-col u-gap-md">
      <form-section heading="A5E.MaterialProperties">
        <update-wrapper
          :document="item"
          updatePath="data.materialProperties"
          v-slot="slotProps"
        >
          <checkbox-group
            :options="Object.entries(config.materialProperties)"
            :selected="data.data.materialProperties"
            :selectionHandler="slotProps.selectionHandler"
          />
        </update-wrapper>
      </form-section>
    </div>

    <dl
      v-else
      class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm"
    >
      <div class="u-flex u-gap-md">
        <dt class="u-text-bold">{{ localize("A5E.MaterialProperties") }}:</dt>
        <dd class="u-m-0 u-p-0">
          <ul
            class="
              u-comma-list
              u-flex
              u-flex-shrink-0
              u-gap-ch
              u-list-style-none
              u-m-0
              u-p-0
              u-w-fit
            "
            v-if="data.data.materialProperties.length"
          >
            <li
              v-for="property in data.data.materialProperties"
              :key="property"
            >
              {{ localize(config.materialProperties[property] ?? component) }}
            </li>
          </ul>

          <template v-else>
            {{ localize("A5E.None") }}
          </template>
        </dd>
      </div>
    </dl>
  </section>
</template>

<script>
import { inject, ref } from "vue";

import FormSection from "../../../../forms/FormSection.vue";
import CheckboxGroup from "../../../../forms/CheckboxGroup.vue";
import UpdateWrapper from "../../../../forms/UpdateWrapper.vue";

export default {
  components: { FormSection, CheckboxGroup, UpdateWrapper },
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
