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
      <h3>Healing Configuration</h3>
      <i
        class="u-text-sm fas"
        :class="editModeActive ? 'fa-chevron-up' : 'fa-edit'"
      ></i>
    </header>

    <div v-if="editModeActive" class="u-flex u-flex-col u-gap-md">
      <template v-if="data.data.healing.length">
        <healing-source
          v-for="(healingRoll, index) in data.data.healing"
          :key="`healing-roll-${index}`"
          v-bind="{ healingRoll, index }"
        />
      </template>

      <button
        class="a5e-button a5e-button--no-shadow u-bg-green u-text-light"
        @click.prevent="onAddHealingSource"
      >
        + {{ localize("A5E.HealingAddSource") }}
      </button>
    </div>

    <template v-else>
      <div class="u-flex u-flex-col u-gap-md">
        <dl
          v-for="(healingRoll, index) in data.data.healing"
          :key="`healing-summary-${index}`"
          class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm"
        >
          <div class="u-flex u-gap-md">
            <dt class="u-text-bold">
              {{
                healingRoll.name || `${localize("A5E.Healing")} #${index + 1}`
              }}:
            </dt>

            <dd class="u-m-0 u-p-0">
              {{ healingRoll.formula }}
            </dd>
          </div>

          <div class="u-flex u-gap-md">
            <dt class="u-text-bold">{{ localize("A5E.HealingType") }}:</dt>

            <dd class="u-m-0 u-p-0">
              {{ localize(config.healingTypes[healingRoll.healingType]) }}
            </dd>
          </div>
        </dl>
      </div>
    </template>
  </section>
</template>

<script>
import { inject, ref } from "vue";

import HealingSource from "../HealingSource.vue";
import FormSection from "../../../../forms/FormSection.vue";
import RadioGroup from "../../../../forms/RadioGroup.vue";

export default {
  components: { HealingSource, FormSection, RadioGroup },
  setup() {
    const appId = inject("appId");
    const data = inject("data");
    const item = inject("item");

    const editModeActive = ref(false);

    function onAddHealingSource() {
      const healing = data.value.data.healing ?? [];

      healing.push({
        name: "",
        formula: "",
        healingType: "",
      });

      item.update({ "data.healing": healing });
    }

    return {
      appId,
      config: CONFIG.A5E,
      data,
      editModeActive,
      item,
      localize: (key) => game.i18n.localize(key),
      onAddHealingSource,
    };
  },
};
</script>
