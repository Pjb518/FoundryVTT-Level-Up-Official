<template>
  <li
    class="a5e-item a5e-item--skill"
    @click.exact="onClickConfigButton(effect)"
  >
    <span class="a5e-skill__value"></span>

    <div class="u-flex u-flex-col u-gap-xxs u-justify-center">
      <header class="u-align-center u-flex u-gap-xs">
        <h3 class="u-text-bold u-text-sm">{{ label }}</h3>
      </header>
    </div>

    <div class="u-align-center u-flex u-gap-xl u-ml-auto u-mr-md">
      <i
        v-if="!sheetIsLocked"
        class="
          u-hover-scale-120 u-hover-text-red u-text-medium u-transition
          fas
          fa-trash
        "
        @click.stop="onDeleteItem"
      ></i>
    </div>
  </li>
</template>


<script>
import { inject } from "vue";

export default {
  props: { label: String, effect: Object },
  setup(props) {
    const actor = inject("actor");
    const data = inject("data");
    const sheetIsLocked = inject("sheetIsLocked");

    function onClickConfigButton(effect) {
      console.log(effect);
      effect.sheet.render(true);
    }

    function onDeleteItem() {
      actor.deleteEmbeddedDocuments("ActiveEffect", [props.effect._id]);
    }

    return {
      config: CONFIG.A5E,
      data,
      onClickConfigButton,
      onDeleteItem,
      localize: (key) => game.i18n.localize(key),
      sheetIsLocked,
    };
  },
};
</script>
