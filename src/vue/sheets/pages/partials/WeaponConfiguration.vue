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
      <h3>Weapon Configuration</h3>
      <i
        class="u-text-sm fas"
        :class="editModeActive ? 'fa-chevron-up' : 'fa-edit'"
      ></i>
    </header>

    <div v-if="editModeActive" class="u-flex u-flex-col u-gap-md">
      <form-section heading="A5E.WeaponProperties">
        <checkbox-group
          :document="item"
          :options="Object.entries(config.weaponProperties)"
          updatePath="data.weaponProperties"
        />
      </form-section>
    </div>

    <dl
      v-else
      class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm"
    >
      <div class="u-flex u-gap-md">
        <dt class="u-flex-shrink-0 u-text-bold">
          {{ localize("A5E.WeaponProperties") }}:
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
            v-if="data.data.weaponProperties.length"
          >
            <li v-for="property in data.data.weaponProperties" :key="property">
              {{ localize(config.weaponProperties[property] ?? property) }}
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
import { computed, inject, ref } from "vue";

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
    const proficient = computed(() => data.value.data.proficient);

    return {
      appId,
      config: CONFIG.A5E,
      data,
      editModeActive,
      item,
      localize: (key) => game.i18n.localize(key),
      proficient,
    };
  },
};
</script>
