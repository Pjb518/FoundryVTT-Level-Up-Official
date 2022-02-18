<template>
  <div
    class="u-flex u-gap-md u-align-center"
    :class="{ 'u-mr-md': sheetIsLocked }"
  >
    <h2 class="u-font-sans-serif u-text-bold u-text-sm u-w-fit">
      {{ localize("A5E.Background") }}:
    </h2>

    <span class="u-text-sm">
      {{ background || localize("A5E.None") }}
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
  props: { background: String, sheetIsLocked: Boolean },
  setup() {
    const actor = inject("actor");

    function onClickConfigButton() {
      actor.configureBackground();
    }

    return {
      localize: (key) => game.i18n.localize(key),
      onClickConfigButton,
    };
  },
};
</script>
