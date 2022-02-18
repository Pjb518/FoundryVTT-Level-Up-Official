<template>
  <div class="u-flex u-gap-ch u-align-center">
    <h2 class="u-font-sans-serif u-text-bold u-text-sm u-w-fit">
      {{ localize("A5E.MovementSpeed") }}:
    </h2>

    <ul
      class="
        u-comma-list
        u-flex
        u-flex-wrap
        u-font-san-serif
        u-gap-ch
        u-list-style-none
        u-m-0
        u-p-0
        u-text-sm
      "
    >
      <li
        v-for="[label, speed] in Object.entries(movement).filter(
          ([_, speed]) => speed
        )"
        :key="label"
      >
        {{ localize(config.movementAbbreviations[label]) }} - {{ speed }}
        {{ localize("A5E.MeasurementFeetAbbr") }}
      </li>
    </ul>

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
  props: { movement: Object, sheetIsLocked: Boolean },
  setup() {
    const actor = inject("actor");

    function onClickConfigButton() {
      actor.configureMovement();
    }

    return {
      config: CONFIG.A5E,
      localize: (key) => game.i18n.localize(key),
      onClickConfigButton,
    };
  },
};
</script>
