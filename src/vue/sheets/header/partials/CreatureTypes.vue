<template>
  <div
    class="u-flex u-gap-md u-align-center"
    :class="{ 'u-mr-md': sheetIsLocked }"
  >
    <h2 class="u-font-sans-serif u-text-bold u-text-sm u-w-fit">
      {{ localize("A5E.CreatureTypesLabel") }}.
    </h2>

    <ul
      v-if="creatureTypes.length"
      class="
        u-flex
        u-flex-wrap
        u-font-san-serif
        u-gap-xs
        u-list-style-none
        u-m-0
        u-p-0
        u-text-xxs
      "
    >
      <li
        v-for="creatureType in creatureTypes"
        :key="creatureType"
        class="a5e-tag a5e-tag--tight"
      >
        {{ localize(config.creatureTypes[creatureType] ?? creatureType) }}
      </li>
    </ul>

    <span v-else>
      {{ localize("A5E.None") }}
    </span>

    <i
      v-if="!sheetIsLocked"
      class="a5e-config-button fas fa-cog"
      @click="onConfigureCreatureTypes"
    ></i>
  </div>
</template>

<script>
import { inject } from "vue";

export default {
  props: { sheetIsLocked: Boolean, creatureTypes: Array },
  setup() {
    const actor = inject("actor");

    function onConfigureCreatureTypes() {
      actor.configureCreatureTypes();
    }

    return {
      config: CONFIG.A5E,
      localize: (key) => game.i18n.localize(key),
      onConfigureCreatureTypes,
    };
  },
};
</script>
