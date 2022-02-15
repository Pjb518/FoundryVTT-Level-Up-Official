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
      <h3>Armor Configuration</h3>
      <i
        class="u-text-sm fas"
        :class="editModeActive ? 'fa-chevron-up' : 'fa-edit'"
      ></i>
    </header>

    <div v-if="editModeActive" class="u-flex u-flex-col u-gap-md">
      <form-section heading="A5E.ArmorCategory">
        <radio-group
          :document="item"
          :options="
            Object.entries(config.armor).filter(([key, _]) => key !== 'shield')
          "
          updatePath="data.armorCategory"
        />
      </form-section>

      <form-section heading="A5E.ArmorProperties">
        <checkbox-group
          :document="item"
          :options="Object.entries(config.armorProperties)"
          updatePath="data.armorProperties"
        />
      </form-section>
    </div>

    <dl
      v-else
      class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm"
    >
      <div class="u-flex u-gap-md">
        <dt class="u-text-bold">{{ localize("A5E.ArmorCategory") }}.</dt>
        <dd class="u-m-0 u-p-0">
          <template v-if="data.data.armorCategory">
            {{
              localize(
                config.armor[data.data.armorCategory] ?? data.data.armorCategory
              )
            }}
          </template>

          <template v-else>
            {{ localize("A5E.Unknown") }}
          </template>
        </dd>
      </div>

      <div class="u-flex u-gap-md">
        <dt class="u-flex-shrink-0 u-text-bold">
          {{ localize("A5E.ArmorProperties") }}.
        </dt>
        <dd class="u-m-0 u-p-0">
          <ul
            class="
              u-comma-list
              u-flex
              u-flex-wrap
              u-gap-ch
              u-list-style-none
              u-m-0
              u-p-0
            "
            v-if="data.data.armorProperties.length"
          >
            <li v-for="property in data.data.armorProperties" :key="property">
              {{ localize(config.armorProperties[property] ?? property) }}
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

import CheckboxGroup from "../../../forms/CheckboxGroup.vue";
import FormSection from "../../../forms/FormSection.vue";
import RadioGroup from "../../../forms/RadioGroup.vue";

export default {
  components: { CheckboxGroup, FormSection, RadioGroup },
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
