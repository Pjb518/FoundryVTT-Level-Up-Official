<template>
  <li
    class="
      u-align-center
      u-bg-gray
      u-flex
      u-flex-col
      u-justify-space-between
      u-py-xs
      u-rounded
      u-w-full
    "
  >
    <h4 class="u-text-lg">{{ localize("A5E.Initiative") }}</h4>

    <i
      class="
        u-hover-scale-120
        u-hover-text-inherit
        u-text-medium
        u-pointer
        u-text-lg
        u-transition-transform
        fas
        fa-dice-d20
      "
      :class="{ 'u-mb-xl u-text-xl': sheetIsLocked }"
      @click="onRollInitiative"
    ></i>

    <div
      v-if="!sheetIsLocked"
      class="a5e-ability-score__buttons u-justify-center"
    >
      <i
        class="a5e-config-button fas fa-cog"
        title="Configure Initiative Bonuses"
        @click="onClickConfigButton"
      ></i>
    </div>
  </li>
</template>

<script>
import { inject } from "vue";

export default {
  props: { sheetIsLocked: Boolean },
  setup() {
    const actor = inject("actor");

    function onClickConfigButton() {
      actor.configureInitiative();
    }

    function onRollInitiative() {
      actor.rollInitiative({ createCombatants: true });
    }

    return {
      localize: (key) => game.i18n.localize(key),
      onClickConfigButton,
      onRollInitiative,
    };
  },
};
</script>
