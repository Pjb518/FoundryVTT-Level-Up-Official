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
      <h3>Range Configuration</h3>
      <i
        class="u-text-sm fas"
        :class="editModeActive ? 'fa-chevron-up' : 'fa-edit'"
      ></i>
    </header>

    <div v-if="editModeActive" class="u-flex u-flex-col u-gap-md">
      <template v-if="data.data.range.length">
        <range-increment
          v-for="(range, index) in data.data.range"
          :key="`range-${index}`"
          v-bind="{ index, range }"
        />
      </template>

      <button
        class="a5e-button a5e-button--no-shadow u-bg-green u-text-light"
        @click.prevent="onAddRangeIncrement"
      >
        + {{ localize("A5E.ItemRangeAddIncrement") }}
      </button>
    </div>

    <div v-else class="u-flex u-flex-col u-gap-md">
      <dl class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm">
        <div class="u-flex u-gap-md">
          <dt class="u-text-bold">{{ localize("A5E.ItemRange") }}:</dt>

          <dd class="u-m-0 u-p-0">
            {{ rangeSummary || localize("A5E.None") }}
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<script>
import { computed, inject, ref } from "vue";

import prepareRangeSummary from "../../../../utils/dataPreparationHelpers/prepareRangeSummary";

import RangeIncrement from "./RangeIncrement.vue";
import FormSection from "../../../../forms/FormSection.vue";

export default {
  components: { RangeIncrement, FormSection },
  setup() {
    const appId = inject("appId");
    const data = inject("data");
    const item = inject("item");

    const editModeActive = ref(false);

    const rangeSummary = computed(() =>
      prepareRangeSummary(data.value.data.range)
    );

    function onAddRangeIncrement() {
      const range = data.value.data.range ?? [];
      range.push("self");

      item.update({ "data.range": range });
    }

    return {
      appId,
      config: CONFIG.A5E,
      data,
      editModeActive,
      item,
      localize: (key) => game.i18n.localize(key),
      onAddRangeIncrement,
      rangeSummary,
    };
  },
};
</script>
