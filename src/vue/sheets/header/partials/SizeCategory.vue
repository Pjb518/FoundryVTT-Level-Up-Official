<template>
  <div
    class="u-flex u-gap-ch u-align-center"
    :class="{ 'u-mr-md': sheetIsLocked }"
  >
    <h2 class="u-font-sans-serif u-text-bold u-text-sm u-w-fit">
      {{ localize("A5E.Size") }}:
    </h2>

    <span class="u-text-sm">
      {{ localize(config.actorSizes[sizeCategory]) || localize("A5E.None") }}
    </span>

    <i
      v-if="!sheetIsLocked"
      class="a5e-config-button fas fa-cog"
      @click="onConfigureSizeCategory"
    ></i>
  </div>
</template>

<script>
import { inject } from "vue";

export default {
  props: { sheetIsLocked: Boolean, sizeCategory: String },
  setup() {
    const actor = inject("actor");

    function onConfigureSizeCategory() {
      actor.configureSizeCategory();
    }

    return {
      config: CONFIG.A5E,
      localize: (key) => game.i18n.localize(key),
      onConfigureSizeCategory,
    };
  },
};
</script>
