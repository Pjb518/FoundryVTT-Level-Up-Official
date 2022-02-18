<template>
  <div
    class="u-flex u-gap-ch u-align-center"
    :class="{ 'u-mr-md': sheetIsLocked }"
  >
    <h2 class="u-font-sans-serif u-text-bold u-text-sm u-w-fit">
      {{ localize("A5E.Culture") }}:
    </h2>

    <span class="u-text-sm">
      {{ culture || localize("A5E.None") }}
    </span>

    <i
      v-if="!sheetIsLocked"
      class="a5e-config-button fas fa-cog"
      @click="onClickConfigButton"
    ></i>
  </div>
</template>

<script>
import { inject } from "vue";

export default {
  props: { culture: String, sheetIsLocked: Boolean },
  setup() {
    const actor = inject("actor");

    function onClickConfigButton() {
      actor.configureCulture();
    }

    return {
      localize: (key) => game.i18n.localize(key),
      onClickConfigButton,
    };
  },
};
</script>
