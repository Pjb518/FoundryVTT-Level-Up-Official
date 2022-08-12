<template>
  <li
    class="a5e-item a5e-item--skill"
    @click.exact="onClickConfigButton(effect)"
  >
    <span></span>
  </li>
</template>


<script>
import { inject } from "vue";

export default {
  props: { label: String, effect: Object },
  setup() {
    const actor = inject("actor");
    const data = inject("data");
    const sheetIsLocked = inject("sheetIsLocked");

    function onClickConfigButton(effect) {
      console.log(effect);
      new Active();
    }

    return {
      config: CONFIG.A5E,
      data,
      onClickConfigButton,
      localize: (key) => game.i18n.localize(key),
      sheetIsLocked,
    };
  },
};
</script>
